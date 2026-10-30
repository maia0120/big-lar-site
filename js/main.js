/* Big Lar – comportamento do site (JavaScript puro, sem dependências) */
(function () {
  'use strict';

  /* ======= CONFIGURAÇÃO ======= */
  var WHATSAPP = '5511983986998'; // DDI + DDD + número, só dígitos
  // Horário de funcionamento em minutos desde 00:00. Índice 0 = domingo.
  var SCHED = [null, [540, 1020], [540, 1080], [540, 1080], [540, 1080], [540, 1080], [540, 780]];
  var DAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var hm = function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); };

  /* ======= MENU MÓVEL ======= */
  var burger = $('#burger');
  var mnav = $('#mnav');
  function setMenu(open) {
    mnav.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function () { setMenu(mnav.hidden); });
  $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ======= CARDS DE AMBIENTES (toque / clique) ======= */
  var cards = $$('#ambientes-grid button.amb');
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      var on = !c.classList.contains('on');
      cards.forEach(function (o) { o.classList.remove('on'); o.setAttribute('aria-pressed', 'false'); });
      if (on) { c.classList.add('on'); c.setAttribute('aria-pressed', 'true'); }
    });
  });

  /* ======= GALERIA + VISUALIZAÇÃO AMPLIADA ======= */
  var tiles = $$('#galeria-grid .g');
  var lb = $('#lb');
  var lbImg = $('#lb-img');
  var lbCap = $('#lb-cap');
  var current = -1;
  var lastFocus = null;

  function show(i) {
    current = (i + tiles.length) % tiles.length;
    var img = $('img', tiles[current]);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = (current + 1) + ' de ' + tiles.length;
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    $('[data-lb="close"].lb-btn', lb).focus();
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.src = '';
    if (lastFocus) lastFocus.focus();
  }
  tiles.forEach(function (t, i) { t.addEventListener('click', function () { openLb(i); }); });
  lb.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lb]');
    if (!b) return;
    var a = b.getAttribute('data-lb');
    if (a === 'close') closeLb();
    if (a === 'prev') show(current - 1);
    if (a === 'next') show(current + 1);
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ======= ABERTO AGORA / FECHADO (horário de Brasília) ======= */
  function nowInSP() {
    try {
      var f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
      var p = {};
      f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday], mins: (+p.hour) * 60 + (+p.minute) };
    } catch (e) {
      var d = new Date();
      return { wd: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function updateStatus() {
    var t = nowInSP();
    var today = SCHED[t.wd];
    var open = !!today && t.mins >= today[0] && t.mins < today[1];
    var text;
    if (open) {
      text = 'Aberto agora · fecha hoje às ' + hm(today[1]);
    } else {
      var sub = '';
      for (var i = 0; i < 8 && !sub; i++) {
        var d = (t.wd + i) % 7;
        var sc = SCHED[d];
        if (sc && (i > 0 || t.mins < sc[0])) {
          sub = 'abre ' + (i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DAYS[d]) + ' às ' + hm(sc[0]);
        }
      }
      text = 'Fechado agora · ' + sub;
    }
    $$('[data-status-text]').forEach(function (el) { el.textContent = text; });
    $$('[data-status-chip]').forEach(function (el) { el.classList.toggle('closed', !open); });
    var row = t.wd === 1 ? 0 : (t.wd >= 2 && t.wd <= 5) ? 1 : t.wd === 6 ? 2 : 3;
    $$('#hrs li').forEach(function (li) { li.classList.toggle('today', +li.getAttribute('data-row') === row); });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ======= FORMULÁRIO -> WHATSAPP ======= */
  var form = $('#orc-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('#f-nome').value.trim();
    var tel = $('#f-tel').value.trim();
    var amb = $('#f-amb').value;
    var msg = $('#f-msg').value.trim();
    var txt = 'Olá! Gostaria de solicitar um orçamento.';
    if (nome) txt += ' Meu nome é ' + nome + '.';
    if (tel) txt += ' Telefone: ' + tel + '.';
    txt += ' Ambiente: ' + amb + '.';
    if (msg) txt += ' ' + msg;
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  });

  /* ======= ANO NO RODAPÉ ======= */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
