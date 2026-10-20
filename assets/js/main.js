var RSVP_EMAIL = 'davidensalamanca@gmail.com';

document.getElementById('rsvp-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var form = this;
  var name = document.getElementById('rsvp-name').value.trim();
  if (!name) return;
  var attending = document.querySelector('input[name="attending"]:checked').value;
  var guests = document.getElementById('rsvp-guests').value;
  var note = document.getElementById('rsvp-note').value.trim();
  var honey = form.querySelector('input[name="_honey"]').value;
  var sendBtn = document.getElementById('rsvp-send');
  var msgEl = document.getElementById('rsvp-msg');
  var isYes = form.querySelector('input[name="attending"]').checked;

  sendBtn.disabled = true;
  sendBtn.classList.add('loading');
  msgEl.classList.remove('show');

  // FormSubmit sends the answer straight to RSVP_EMAIL, no e-mail app needed
  fetch('https://formsubmit.co/ajax/' + RSVP_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: 'Visszajelzés – ' + name,
      _template: 'table',
      _captcha: 'false',
      _honey: honey,
      'Név': name,
      'Válasz': attending,
      'Létszám': guests,
      'Megjegyzés': note || '—'
    })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (String(data.success) !== 'true') throw new Error(data.message || 'not sent');
      showThanks(isYes);
    })
    .catch(function () {
      // Fallback: open the guest's e-mail app with the answer filled in
      var bodyLines = [
        'Név: ' + name,
        'Válasz: ' + attending,
        'Létszám: ' + guests
      ];
      if (note) bodyLines.push('Megjegyzés: ' + note);
      var subject = encodeURIComponent('Visszajelzés – ' + name);
      var body = encodeURIComponent(bodyLines.join('\n'));
      sendBtn.disabled = false;
      sendBtn.classList.remove('loading');
      msgEl.textContent = 'Nem sikerült közvetlenül elküldeni, ezért megnyitjuk az e-mail alkalmazásodat a kitöltött válasszal — csak küldd el!';
      msgEl.classList.add('show');
      window.location.href = 'mailto:' + RSVP_EMAIL + '?subject=' + subject + '&body=' + body;
    });

  function showThanks(yes) {
    var thanks = document.getElementById('rsvp-thanks');
    document.getElementById('rsvp-thanks-text').textContent = yes
      ? 'Alig várjuk, hogy veletek ünnepelhessünk július 3-án Egerben!'
      : 'Sajnáljuk, hogy nem tudtok eljönni — köszönjük, hogy jeleztétek.';
    form.classList.add('leaving');
    setTimeout(function () {
      form.hidden = true;
      thanks.hidden = false;
      requestAnimationFrame(function () { thanks.classList.add('show'); });
      thanks.querySelector('h3').focus({ preventScroll: true });
    }, 350);
  }
});

document.documentElement.classList.add('js');
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
