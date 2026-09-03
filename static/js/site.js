/* =============================================================
   arendesai.com - terminal CV behaviours. no dependencies.
   ============================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var started = Date.now();

  /* -- boot sequence ----------------------------------------- */

  var BOOT = [
    'arenOS 5.2 // phosphor terminal',
    'mounting /dev/grid .................. <b class="ok">ok</b>',
    'loading miso.dayahead.feed .......... <b class="ok">ok</b>',
    'loading forecast.weights [chronos2] . <b class="ok">ok</b>',
    'calibrating optimism ................ <b class="warn">partial</b>',
    'operator detected: DESAI, AREN K.',
    'handshake complete. welcome.'
  ];

  function runBoot() {
    var el = document.getElementById('boot');
    var log = document.getElementById('boot-log');
    if (!el || !log) { return; }

    var skip = reduced || sessionStorage.getItem('booted') === '1';
    if (skip) { el.parentNode.removeChild(el); return; }

    var line = 0, ch = 0, timer;

    function end() {
      sessionStorage.setItem('booted', '1');
      clearTimeout(timer);
      el.classList.add('done');
      window.removeEventListener('keydown', end);
      el.removeEventListener('click', end);
      setTimeout(function () { if (el.parentNode) { el.parentNode.removeChild(el); } }, 550);
    }

    function step() {
      if (line >= BOOT.length) { timer = setTimeout(end, 550); return; }
      var raw = BOOT[line];
      var plain = raw.replace(/<[^>]+>/g, '');
      var divs = log.children;
      var cur = divs[line];
      if (!cur) {
        cur = document.createElement('div');
        cur.className = 'boot-line caret';
        log.appendChild(cur);
        if (line > 0) { divs[line - 1].classList.remove('caret'); }
      }
      ch += 2;
      if (ch >= plain.length) {
        cur.innerHTML = raw;           // reveal markup once the line is done
        line++; ch = 0;
        timer = setTimeout(step, 130);
      } else {
        cur.textContent = plain.slice(0, ch);
        timer = setTimeout(step, 12);
      }
    }

    window.addEventListener('keydown', end);
    el.addEventListener('click', end);
    timer = setTimeout(step, 260);
  }

  /* -- HUD readouts ------------------------------------------ */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function clock() {
    var c = document.getElementById('hud-clock');
    if (!c) { return; }
    var d = new Date();
    c.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + ' local';
    var up = document.getElementById('foot-uptime');
    if (up) {
      var s = Math.floor((Date.now() - started) / 1000);
      up.textContent = 'session ' + pad(Math.floor(s / 60)) + ':' + pad(s % 60);
    }
  }

  function scrollDepth() {
    var el = document.getElementById('hud-scroll');
    if (!el) { return; }
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    el.textContent = 'depth ' + pad(Math.floor(pct / 100)) + pad(pct % 100) + '%';
  }

  function crosshair() {
    var el = document.getElementById('hud-xy');
    if (!el) { return; }
    window.addEventListener('mousemove', function (e) {
      el.textContent = 'x ' + pad(e.clientX) + ' y ' + pad(e.clientY);
    }, { passive: true });
  }

  /* -- scroll spy + reveal ----------------------------------- */

  function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduced) {
      Array.prototype.forEach.call(items, function (i) { i.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        en.target.classList.add('in');
        var t = en.target.querySelector('[data-scramble]');
        if (t && !t.dataset.done) { scramble(t); t.dataset.done = '1'; }
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(items, function (i) { io.observe(i); });
  }

  var GLYPHS = '!<>-_\\/[]{}=+*^?#01';

  function scramble(el) {
    if (reduced) { return; }
    var target = el.textContent;
    var frame = 0;
    var id = setInterval(function () {
      var out = '';
      for (var i = 0; i < target.length; i++) {
        if (target[i] === ' ') { out += ' '; continue; }
        out += i < frame / 2
          ? target[i]
          : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      frame++;
      if (frame / 2 >= target.length) { clearInterval(id); el.textContent = target; }
    }, 28);
  }

  function spy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);
    if (!sections.length) { return; }

    function update() {
      var y = window.scrollY + window.innerHeight * 0.32;
      var active = 0;
      sections.forEach(function (s, i) { if (s.offsetTop <= y) { active = i; } });
      links.forEach(function (a, i) { a.classList.toggle('active', i === active); });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* -- console ----------------------------------------------- */

  var HELP = [
    'available commands',
    '  help ......... this list',
    '  whoami ....... the short version',
    '  exp .......... work history',
    '  projects ..... things that are deployed',
    '  stack ........ tools i reach for',
    '  contact ...... how to reach me',
    '  resume ....... download the pdf',
    '  goto <sec> ... jump to a section (ident|experience|projects|education|stack|contact)',
    '  theme ........ toggle phosphor green / amber',
    '  uptime ....... session timer',
    '  clear ........ wipe the screen',
    '  exit ......... close console'
  ].join('\n');

  function initConsole() {
    var box = document.getElementById('console');
    var out = document.getElementById('con-out');
    var form = document.getElementById('con-form');
    var input = document.getElementById('con-input');
    var hint = document.getElementById('console-hint');
    var openBtn = document.getElementById('open-console-btn');
    if (!box || !out || !form || !input) { return; }

    var history = [], hi = -1, amber = false;

    function write(text, cls) {
      var d = document.createElement('div');
      if (cls) { d.className = cls; }
      d.textContent = text;
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
    }

    function open() {
      box.classList.add('open');
      box.setAttribute('aria-hidden', 'false');
      if (!out.childElementCount) {
        write('arenOS console. type `help`.');
      }
      input.focus();
    }
    function close() {
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      input.blur();
    }
    function toggle() { box.classList.contains('open') ? close() : open(); }

    function run(raw) {
      var parts = raw.trim().split(/\s+/);
      var cmd = (parts[0] || '').toLowerCase();
      var arg = (parts[1] || '').toLowerCase();
      if (!cmd) { return; }

      switch (cmd) {
        case 'help': write(HELP); break;
        case 'whoami':
          write('aren desai - data scientist at madison gas & electric.\n' +
                'forecasting, optimization and risk for miso power markets.\n' +
                'b.s. computer science & data science, uw-madison.');
          break;
        case 'exp':
          write('2024-now  energy supply analyst .... madison gas & electric\n' +
                '2024-2025 energy supply & trading ... madison gas & electric (intern)\n' +
                '2023-2024 data analytics ........... compeer financial (intern)\n' +
                '2023-2024 finance lead ............. google developer student club');
          break;
        case 'projects':
          write('energy-pricing-journalist  https://energy-pricing-journalist.onrender.com\n' +
                'wrover-software            https://github.com/WisconsinRobotics/WRoverSoftware');
          break;
        case 'stack':
          write('python r sql java c++ | pytorch tensorflow scikit-learn scipy or-tools\n' +
                'pandas polars duckdb airflow | gcp azure docker cloudflare linux');
          break;
        case 'contact':
          write('mail   arenkdesai@gmail.com\ngithub github.com/ArenKDesai\nnode   madison, wi');
          break;
        case 'resume':
          write('fetching /documents/resume.pdf ...');
          window.open('/documents/resume.pdf', '_blank');
          break;
        case 'goto':
          var t = document.getElementById(arg);
          if (t) { close(); t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
          else { write('no such section: ' + arg, 'err'); }
          break;
        case 'theme':
          amber = !amber;
          var r = document.documentElement.style;
          if (amber) {
            r.setProperty('--phos', '#ffb95c');
            r.setProperty('--phos-soft', '#d99a45');
            r.setProperty('--phos-dim', '#7a5726');
            r.setProperty('--line', 'rgba(255,185,92,0.20)');
            r.setProperty('--faint', 'rgba(255,185,92,0.10)');
            write('phosphor: amber (p3)');
          } else {
            ['--phos', '--phos-soft', '--phos-dim', '--line', '--faint']
              .forEach(function (k) { r.removeProperty(k); });
            write('phosphor: green (p1)');
          }
          break;
        case 'uptime':
          var s = Math.floor((Date.now() - started) / 1000);
          write('up ' + pad(Math.floor(s / 60)) + 'm ' + pad(s % 60) + 's');
          break;
        case 'sudo':
          write('nice try.', 'err');
          break;
        case 'ls':
          write('ident/  experience/  projects/  education/  stack/  contact/  resume.pdf');
          break;
        case 'clear': out.innerHTML = ''; break;
        case 'exit': case 'q': close(); break;
        default:
          write('command not found: ' + cmd + '  (try `help`)', 'err');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      if (!v.trim()) { return; }
      write('> ' + v, 'cmd');
      history.unshift(v); hi = -1;
      input.value = '';
      run(v);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); }
      if (e.key === 'ArrowUp' && history.length) {
        hi = Math.min(hi + 1, history.length - 1); input.value = history[hi];
        e.preventDefault();
      }
      if (e.key === 'ArrowDown' && history.length) {
        hi = Math.max(hi - 1, -1); input.value = hi < 0 ? '' : history[hi];
        e.preventDefault();
      }
    });

    window.addEventListener('keydown', function (e) {
      var typing = /input|textarea/i.test(e.target.tagName);
      if ((e.key === '`' || e.key === '~') && !typing) { e.preventDefault(); toggle(); }
      if (e.key === 'Escape') { close(); }
    });

    if (hint) { hint.addEventListener('click', open); }
    if (openBtn) { openBtn.addEventListener('click', open); }
    if (location.hash === '#console') { open(); }   // deep link: /#console
  }

  /* -- go ----------------------------------------------------- */

  function init() {
    runBoot();
    clock(); setInterval(clock, 1000);
    scrollDepth();
    window.addEventListener('scroll', scrollDepth, { passive: true });
    crosshair();
    reveal();
    spy();
    initConsole();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
