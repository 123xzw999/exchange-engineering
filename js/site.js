/* ==========================================================================
   EXCHANGE ENGINEERING — site shell
   注入导航 / 侧栏目录 / 上下页 · 滚动进度 · scrollspy · 揭示动画（可降级）
   ========================================================================== */
(function () {
  'use strict';

  /* 只在 JS 可用时启用揭示动画，脚本挂了内容也不会隐形 */
  document.documentElement.classList.add('js-reveal');

  var CHAPTERS = [
    { id: '00', slug: '00-foundations',  title: '从零到一',       sub: 'Foundations',  desc: '需求、领域建模、架构、迭代 —— 一个软件被造出来的完整链路' },
    { id: '01', slug: '01-domain',       title: '业务全景',       sub: 'Domain',       desc: '现货、杠杆、合约、理财、法币通道，以及它们背后的资金关系' },
    { id: '02', slug: '02-architecture', title: '系统架构',       sub: 'Architecture', desc: '分层、服务边界、事件驱动，以及一笔下单请求的完整旅程' },
    { id: '03', slug: '03-trading-core', title: '交易链核心',     sub: 'Trading Core', desc: '订单生命周期、订单簿、撮合引擎、定序、成交回报与行情分发' },
    { id: '04', slug: '04-ledger',       title: '账本与清结算',   sub: 'Ledger',       desc: '复式记账、资金冻结与解冻、逐笔结算、对账三道防线' },
    { id: '05', slug: '05-fund-safety',  title: '资金安全',       sub: 'Fund Safety',  desc: '资金守恒定律、冷热分离、提现风控、审计留痕 —— 币为什么不会消失' },
    { id: '06', slug: '06-security',     title: '网络安全',       sub: 'Security',     desc: '威胁建模、纵深防御、密钥管理、内控四眼原则、应急响应' },
    { id: '07', slug: '07-interface',    title: '界面设计',       sub: 'Interface',    desc: '交易终端的信息架构、排印、色彩、数据密度与关键组件' },
    { id: '08', slug: '08-engineering',  title: '技术栈',         sub: 'Engineering',  desc: '语言与存储选型、撮合性能、可观测性、压测与调优' },
    { id: '09', slug: '09-launch',       title: '上线与演进',     sub: 'Launch',       desc: '发布策略、容量规划、SLO、事故管理与长期演进路径' }
  ];

  var body = document.body;
  var isHome = body.getAttribute('data-page') === 'home';
  var currentSlug = body.getAttribute('data-page') || '';
  var root = isHome ? '' : '../';
  var path = 'chapters/';   /* 章节始终在 chapters/ 下，首页与章节页都按此拼路径 */

  /* ---------- helpers ---------- */
  function h(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function url(slug) { return root + path + slug + '.html'; }

  /* ---------- topbar ---------- */
  function renderTopbar() {
    var bar = document.querySelector('[data-topbar]');
    if (!bar) return;
    var nav = '';
    var quick = [CHAPTERS[0], CHAPTERS[3], CHAPTERS[5], CHAPTERS[6]];
    quick.forEach(function (c) {
      nav += '<a href="' + url(c.slug) + '"' + (c.slug === currentSlug ? ' aria-current="page"' : '') + '>' +
             c.title + '</a>';
    });

    bar.className = 'topbar';
    bar.innerHTML =
      '<a class="brand" href="' + (root || './') + 'index.html">' +
        '<svg class="brand__glyph" viewBox="0 0 26 26" fill="none" aria-hidden="true">' +
          '<rect x=".6" y=".6" width="24.8" height="24.8" rx="6" stroke="rgba(214,166,76,.45)" stroke-width="1"/>' +
          '<path d="M6.5 16.5 L13 6.5 L19.5 16.5" stroke="#D6A64C" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M9.4 14.6 H16.6" stroke="rgba(232,235,240,.5)" stroke-width="1.2" stroke-linecap="round"/>' +
          '<circle cx="13" cy="19.4" r="1.5" fill="#D6A64C"/>' +
        '</svg>' +
        '<span class="brand__text">' +
          '<span class="brand__name">交易系统工程</span>' +
          '<span class="brand__sub">Exchange Engineering</span>' +
        '</span>' +
      '</a>' +
      '<span class="topbar__spacer"></span>' +
      '<nav class="topbar__nav">' + nav + '</nav>' +
      '<button class="burger" type="button" aria-label="打开目录" aria-expanded="false"><span></span></button>';
  }

  /* ---------- rail ---------- */
  function renderRail() {
    var rail = document.querySelector('[data-rail]');
    if (!rail) return;
    rail.className = 'rail';
    var out = '<div class="rail__group"><span class="rail__label">目录 · Contents</span>';
    CHAPTERS.forEach(function (c) {
      out += '<a class="rail__item" href="' + url(c.slug) + '"' +
             (c.slug === currentSlug ? ' aria-current="page"' : '') + '>' +
             '<span class="rail__idx">' + c.id + '</span>' +
             '<span class="rail__title">' + c.title + '</span></a>';
    });
    out += '</div><div class="rail__group" data-toc-host></div>';
    rail.innerHTML = out;
  }

  /* ---------- 页内目录（由正文标题自动生成） ---------- */
  function buildToc() {
    var host = document.querySelector('[data-toc-host]');
    var art = document.querySelector('[data-article]');
    if (!host || !art) return;
    var heads = art.querySelectorAll('h2.sec, h3.sub');
    if (!heads.length) { host.remove(); return; }

    var html = '<span class="rail__label">本章 · Sections</span><nav class="rail__toc">';
    heads.forEach(function (hd, i) {
      if (!hd.id) {
        hd.id = 'sec-' + (i + 1);
      }
      var label = hd.getAttribute('data-toc') || hd.textContent.replace(/\s+/g, ' ').trim();
      html += '<a href="#' + hd.id + '" data-spy="' + hd.id + '">' + label + '</a>';
    });
    html += '</nav>';
    host.innerHTML = html;

    /* 标题悬浮锚点 */
    heads.forEach(function (hd) {
      var a = h('a', { class: 'anchor-link', href: '#' + hd.id, 'aria-label': '锚点' }, '#');
      hd.appendChild(a);
    });
  }

  /* ---------- scrollspy ---------- */
  function initSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-spy]'));
    if (!links.length) return;
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('data-spy')); })
                       .filter(Boolean);
    if (!targets.length) return;

    var offset = 130;
    function tick() {
      var best = null, bestTop = -Infinity;
      targets.forEach(function (t) {
        var top = t.getBoundingClientRect().top;
        if (top - offset <= 0 && top > bestTop) { bestTop = top; best = t; }
      });
      if (!best) best = targets[0];
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-spy') === best.id);
      });
    }
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { tick(); queued = false; });
    }, { passive: true });
    tick();
  }

  /* ---------- 上下页 ---------- */
  function renderPager() {
    var host = document.querySelector('[data-pager]');
    if (!host) return;
    var i = CHAPTERS.map(function (c) { return c.slug; }).indexOf(currentSlug);
    if (i < 0) return;
    var prev = CHAPTERS[i - 1];
    var next = CHAPTERS[i + 1];
    var out = '';
    if (prev) out += '<a class="prev" href="' + url(prev.slug) + '"><span class="dir">上一章</span>' +
                     '<span class="ttl">' + prev.id + ' · ' + prev.title + '</span></a>';
    else out += '<a class="prev" href="' + root + 'index.html"><span class="dir">返回</span>' +
                '<span class="ttl">总目录</span></a>';
    if (next) out += '<a class="next" href="' + url(next.slug) + '"><span class="dir">下一章</span>' +
                     '<span class="ttl">' + next.id + ' · ' + next.title + '</span></a>';
    else out += '<a class="next" href="' + root + 'index.html"><span class="dir">完</span>' +
                '<span class="ttl">回到总目录</span></a>';
    host.className = 'pager';
    host.innerHTML = out;
  }

  /* ---------- 滚动进度 ---------- */
  function initProgress() {
    var bar = document.querySelector('.progress i');
    if (!bar) return;
    function tick() {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      bar.style.width = Math.max(0, Math.min(100, p)) + '%';
    }
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { tick(); queued = false; });
    }, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* ---------- 揭示动画（三重保障） ---------- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.rv'));
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (n) { io.observe(n); });

    /* 视口兜底：任何已在视口内却没被标记的，直接显示 */
    function sweep() {
      items.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) n.classList.add('in');
      });
    }
    window.addEventListener('load', sweep);
    window.addEventListener('resize', sweep);
    setTimeout(sweep, 400);
  }

  /* ---------- 代码复制 ---------- */
  function initCodeCopy() {
    document.querySelectorAll('.code__copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pre = btn.closest('.code').querySelector('pre');
        if (!pre) return;
        var txt = pre.innerText;
        var done = function () {
          var old = btn.textContent;
          btn.textContent = '已复制';
          setTimeout(function () { btn.textContent = old; }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(txt).then(done, function () {});
        } else {
          var ta = document.createElement('textarea');
          ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* ---------- 移动端抽屉 ---------- */
  function initBurger() {
    var btn = document.querySelector('.burger');
    var rail = document.querySelector('.rail');
    var scrim = document.querySelector('.scrim');
    if (!btn || !rail) return;
    function close() {
      rail.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-on');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function () {
      var on = rail.classList.toggle('is-open');
      if (scrim) scrim.classList.toggle('is-on', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    if (scrim) scrim.addEventListener('click', close);
    rail.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- boot ---------- */
  function boot() {
    renderTopbar();
    renderRail();
    buildToc();
    renderPager();
    initProgress();
    initSpy();
    initReveal();
    initCodeCopy();
    initBurger();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
