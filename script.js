(function () {
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  root.classList.add('js');

  /* Photo: show initials if malav.jpg is not found */
  var photo = $('photo');
  if (photo) {
    photo.addEventListener('error', function () { photo.remove(); });
    if (photo.complete && !photo.naturalWidth) photo.remove();
  }

  /* Feature 1: dark / light mode */
  var themeBtn = $('theme');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  }
  function syncIcon() { themeBtn.textContent = isDark() ? '☾' : '☼'; }
  try {
    var saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  syncIcon();
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncIcon();
  });

  /* Feature 2: mobile menu */
  var menuBtn = $('menu'), menu = $('links');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.textContent = open ? '✕' : '☰';
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* Feature 3: contact form validation */
  var form = $('form'), note = $('note');
  var fields = [
    { el: $('n'), check: function (v) { return v.length >= 2 ? '' : 'Please enter your name (at least 2 characters).'; } },
    { el: $('e'), check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.'; } },
    { el: $('m'), check: function (v) { return v.length >= 10 ? '' : 'Please write a message of at least 10 characters.'; } }
  ];
  function validate(f) {
    var message = f.check(f.el.value.trim());
    $(f.el.id + '-err').textContent = message;
    f.el.setAttribute('aria-invalid', String(message !== ''));
    return message === '';
  }
  fields.forEach(function (f) {
    f.el.addEventListener('input', function () {
      if (f.el.getAttribute('aria-invalid') === 'true') validate(f);
      note.textContent = '';
    });
  });
  $('m').addEventListener('input', function () { $('count').textContent = this.value.length + ' / 500'; });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var invalid = fields.filter(function (f) { return !validate(f); });
    if (invalid.length) { invalid[0].el.focus(); note.textContent = ''; return; }
    var name = $('n').value.trim(), email = $('e').value.trim(), text = $('m').value.trim();
    location.href = 'mailto:malavgondaliya2007@gmail.com?subject=' +
      encodeURIComponent('Portfolio message from ' + name) +
      '&body=' + encodeURIComponent(text + '\n\n— ' + name + ' (' + email + ')');
    note.textContent = 'Opening your email app. Press send there to deliver the message.';
  });

  /* Feature 4: project filter */
  var filterButtons = document.querySelectorAll('.fb');
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wanted = btn.getAttribute('data-f');
      filterButtons.forEach(function (b) {
        b.classList.toggle('on', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      document.querySelectorAll('.proj').forEach(function (card) {
        card.hidden = wanted !== 'all' && card.getAttribute('data-cat').split(' ').indexOf(wanted) === -1;
        card.classList.add('in');
      });
    });
  });

  /* Scroll animations */
  var reveal = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    reveal.forEach(function (el) { observer.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add('in'); });
  }

  /* Progress bar, active menu link and back-to-top button */
  var sections = document.querySelectorAll('main section, .hero');
  var navLinks = document.querySelectorAll('.links a');
  var topBtn = $('top');
  function onScroll() {
    var y = scrollY + 120, current = 'home';
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + current); });
    var height = root.scrollHeight - innerHeight;
    $('bar').style.width = (height > 0 ? scrollY / height * 100 : 0) + '%';
    topBtn.classList.toggle('show', scrollY > 500);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  topBtn.addEventListener('click', function () { scrollTo({ top: 0 }); });

  /* Typing effect */
  var words = ['AI & Data Science', 'Python Programming', 'Web Development', 'Design Thinking'];
  var wi = 0, ci = 0, deleting = false, typed = $('typed');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    (function tick() {
      var w = words[wi];
      ci += deleting ? -1 : 1;
      typed.textContent = w.slice(0, ci);
      var delay = deleting ? 35 : 70;
      if (!deleting && ci === w.length) { deleting = true; delay = 1400; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  $('yr').textContent = new Date().getFullYear();
})();
