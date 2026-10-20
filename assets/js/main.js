document.getElementById('rsvp-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('rsvp-name').value.trim();
  if (!name) return;
  var attending = document.querySelector('input[name="attending"]:checked').value;
  var guests = document.getElementById('rsvp-guests').value;
  var note = document.getElementById('rsvp-note').value.trim();

  var bodyLines = [
    'Név: ' + name,
    'Válasz: ' + attending,
    'Létszám: ' + guests
  ];
  if (note) bodyLines.push('Megjegyzés: ' + note);

  var subject = encodeURIComponent('Visszajelzés – ' + name);
  var body = encodeURIComponent(bodyLines.join('\n'));
  var msgEl = document.getElementById('rsvp-msg');
  msgEl.classList.add('show');
  window.location.href = 'mailto:davidensalamanca@gmail.com?subject=' + subject + '&body=' + body;
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
