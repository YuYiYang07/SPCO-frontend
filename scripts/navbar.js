/**
 * SPCO Navbar v3
 * Web Component — <spco-navbar></spco-navbar>
 *
 * Features:
 *  - Left: 新加坡理工学院華樂团 (Zhi Mang Xing)，scroll 后收拢至 華樂 logo only
 *  - Centre: HOME SECTIONAL NEWS WORKS (desktop)
 *  - Right: 水墨同心圆 (SVG) → opens popover (lang / login / settings)
 *  - Mobile (≤781px): hamburger → fullscreen overlay，逐行展现链接
 *  - Ink-wash parchment aesthetic, consistent with existing site
 *
 * Dependencies (already loaded by parent page):
 *  - GSAP + ScrollTrigger (CDN)
 *  - Google Fonts: Zhi Mang Xing, Noto Sans SC, Inter
 *  - Tailwind CSS (optional, navbar uses own CSS vars)
 *
 * Usage:
 *  <spco-navbar data-lang="en"></spco-navbar>
 */

/* ─────────────────────────────────────────────
   INJECTED STYLES  (shadow-dom-free for easy
   site-wide CSS overrides)
───────────────────────────────────────────── */
const NAVBAR_CSS = `
/* ── Reset scope ── */
#spco-nav * { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Root vars (mirror site palette) ── */
#spco-nav {
  --ink:        #1a1a1a;
  --parchment:  #f5f0e8;
  --rice:       #faf7f2;
  --accent:     #8b2500;
  --gold:       #c4a35a;
  --nav-h:      64px;
  --ease-ink:   cubic-bezier(.4,0,.2,1);
}

/* ── Navbar shell ── */
#spco-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-h);
  z-index: 900;
  display: flex;
  align-items: center;
  padding: 0 clamp(1.25rem, 4vw, 2.5rem);
  transition: background 0.4s var(--ease-ink),
              backdrop-filter 0.4s var(--ease-ink),
              box-shadow 0.4s var(--ease-ink);
}
#spco-nav.nav-scrolled {
  background: rgba(250, 247, 242, 0.88);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  box-shadow: 0 1px 0 rgba(26,26,26,0.06);
}

/* ── Inner layout ── */
.spco-nav-inner {
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

/* ════════════════════════════════════════════
   BRAND / LOGO (left)
════════════════════════════════════════════ */
.spco-brand {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  text-decoration: none;
  flex-shrink: 0;
  overflow: hidden;
}

/* 全称文字 — Zhi Mang Xing */
.brand-full {
  display: flex;
  align-items: baseline;
  gap: 0;
  white-space: nowrap;
  transition: opacity 0.35s var(--ease-ink),
              max-width 0.45s var(--ease-ink),
              transform 0.45s var(--ease-ink);
  overflow: hidden;
  max-width: 420px;
  opacity: 1;
}
.brand-prefix,
.brand-suffix {
  font-family: 'Zhi Mang Xing', cursive;
  font-size: 1.25rem;
  color: var(--ink);
  letter-spacing: 0.04em;
  line-height: 1;
  transition: max-width 0.45s var(--ease-ink),
              opacity 0.3s var(--ease-ink);
  overflow: hidden;
  white-space: nowrap;
}
/* 新加坡理工学院 */
.brand-prefix { max-width: 160px; }
/* 团 */
.brand-suffix { max-width: 40px; }

/* 華樂 SVG logo (always visible) */
.brand-logo-wrap {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.brand-logo-svg {
  height: 2rem;
  width: auto;
  /* Custom SVG calligraphy for 華樂 */
}

/* Scrolled state: hide prefix + suffix, keep logo */
#spco-nav.nav-scrolled .brand-prefix,
#spco-nav.nav-scrolled .brand-suffix {
  max-width: 0;
  opacity: 0;
}

/* ════════════════════════════════════════════
   NAV LINKS (centre, desktop)
════════════════════════════════════════════ */
.spco-nav-links {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  list-style: none;
  flex: 1;
  justify-content: center;
}
.spco-nav-links a {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(26,26,26,0.5);
  text-decoration: none;
  position: relative;
  padding-bottom: 2px;
  transition: color 0.25s var(--ease-ink);
}

.spco-nav-links a:hover { color: var(--ink); }
.spco-nav-links a:hover::after,
.spco-nav-links a.active::after { width: 100%; }
.spco-nav-links a.active { color: var(--ink); }

/* Active separator line (left of HOME) */
.spco-nav-links li.has-active-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.spco-nav-links li.has-active-bar::before {
  content: '';
  display: block;
  width: 1.5px;
  height: 1.2em;
  background: var(--accent);
  opacity: 0.8;
}

/* ════════════════════════════════════════════
   RIGHT: CONCENTRIC CIRCLE BUTTON
════════════════════════════════════════════ */
.spco-orb-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s var(--ease-ink);
}
.spco-orb-btn:hover { transform: scale(1.08); }
.spco-orb-btn svg {
  width: 36px;
  height: 36px;
  display: block;
}

/* Popover */
.spco-orb-popover {
  position: absolute;
  top: calc(var(--nav-h) + 8px);
  right: clamp(1rem, 4vw, 2rem);
  width: 220px;
  background: var(--rice);
  border: 1px solid rgba(26,26,26,0.09);
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(26,26,26,0.1),
              0 1px 4px rgba(26,26,26,0.06);
  padding: 1.25rem !important;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 0.25s var(--ease-ink),
              transform 0.25s var(--ease-ink);
  z-index: 950;
  gap: 0.8 rem;
}
.spco-orb-popover.open {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.popover-section-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(26,26,26,0.35);
  margin-bottom: 0.5rem;
  padding-top: 0.5rem !important;
}
.popover-divider {
  width: 100%;
  height: 1px;
  background: rgba(26,26,26,0.06);
  margin: 0.85rem 0;
}
.popover-lang-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  padding-bottom: 0.5rem !important;
}
.popover-lang-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  border: 1px solid rgba(26,26,26,0.12);
  border-radius: 3px;
  background: transparent;
  color: rgba(26,26,26,0.55);
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s;
}
.popover-lang-btn:hover,
.popover-lang-btn.active {
  background: var(--ink);
  color: var(--rice);
  border-color: var(--ink);
}
.popover-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 8px 0 !important;
  color: rgba(26,26,26,0.75);
  transition: background 0.15s;
}
.popover-link:hover { background: rgba(26,26,26,0.04); padding-left: 4px; margin-left: -4px; }
  border-radius: 3px;
  transition: background 0.15s;
}
.popover-link:hover { background: rgba(26,26,26,0.04); padding-left: 4px; margin-left: -4px; }
.popover-link svg { width: 14px; height: 14px; flex-shrink: 0; stroke: rgba(26,26,26,0.4); }
.popover-link:hover svg { stroke: rgba(26,26,26,0.7); }

/* NEW */
.popover-link-text { display: flex; flex-direction: column; gap: 1px; }
.popover-link-main { font-family: 'Inter', sans-serif; font-size: 12.5px; color: rgba(26,26,26,0.75); }
.popover-link-sub  { font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(26,26,26,0.35); }

/* ════════════════════════════════════════════
   MOBILE HAMBURGER BUTTON
════════════════════════════════════════════ */
.spco-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  gap: 5.5px;
  border-radius: 3px;
  flex-shrink: 0;
  padding: 0;
  position: relative;
  z-index: 1010;
}
/* SVG hamburger / X */
.spco-burger svg {
  width: 24px;
  height: 18px;
  overflow: visible;
}
.burger-line {
  stroke: var(--ink);
  stroke-width: 1.6;
  stroke-linecap: round;
  transform-origin: center;
  transition: transform 0.3s var(--ease-ink),
              opacity 0.2s var(--ease-ink),
              stroke-dashoffset 0.3s var(--ease-ink);
}
/* X state */
.spco-burger.open .bl-top {
  transform: translateY(6px) rotate(45deg);
}
.spco-burger.open .bl-mid { opacity: 0; transform: scaleX(0); }
.spco-burger.open .bl-bot {
  transform: translateY(-6px) rotate(-45deg);
}

/* ════════════════════════════════════════════
   MOBILE FULLSCREEN OVERLAY
════════════════════════════════════════════ */
.spco-mobile-menu {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;   /* 不用 inset，兼容性更好 */
  width: 100%;
  height: 100%;
  background: var(--rice);
  z-index: 1000;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  /* 不用 opacity transition 做 open/close，改用 visibility + opacity */
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.35s var(--ease-ink),
              visibility 0.35s var(--ease-ink);
  /* 关键：隔离滚动影响 */
  overflow: hidden;
  overscroll-behavior: contain;
}
.spco-mobile-menu.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
/* Subtle ink texture overlay */
.spco-mobile-menu::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse 600px 400px at 20% 80%, rgba(139,37,0,0.04) 0%, transparent 70%),
    radial-gradient(ellipse 400px 300px at 80% 20%, rgba(26,26,26,0.03) 0%, transparent 70%);
  pointer-events: none;
}
.mobile-menu-links {
  list-style: none;
  text-align: center;
  width: 100%;
  position: relative;
  margin-bottom: 2rem !important;
  padding: 0;
}
.mobile-menu-links li {
  overflow: hidden;
  border-bottom: 1px solid rgba(26,26,26,0.05);
  padding-bottom: 0.5rem !important;
  padding-top: 0.5rem !important;
}
.mobile-menu-links li:first-child {
  border-top: 1px solid rgba(26,26,26,0.05);
}
.mobile-menu-links a {
  display: block;
  padding: 1.1rem 0;
  font-family: "Lora", serif;
  font-size: clamp(1.5rem, 5vw, 2rem);
  color: rgba(26,26,26,0.65);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.25s var(--ease-ink),
              padding-left 0.25s var(--ease-ink);
  transform: translateY(40px);
  opacity: 0;
  transition: transform 0.4s var(--ease-ink),
              opacity 0.4s var(--ease-ink),
              color 0.2s;
}
.spco-mobile-menu.open .mobile-menu-links a {
  transform: translateY(0);
  opacity: 1;
}
/* Stagger each link */
.spco-mobile-menu.open .mobile-menu-links li:nth-child(1) a { transition-delay: 0.05s; }
.spco-mobile-menu.open .mobile-menu-links li:nth-child(2) a { transition-delay: 0.10s; }
.spco-mobile-menu.open .mobile-menu-links li:nth-child(3) a { transition-delay: 0.15s; }
.spco-mobile-menu.open .mobile-menu-links li:nth-child(4) a { transition-delay: 0.20s; }
.spco-mobile-menu.open .mobile-menu-links li:nth-child(5) a { transition-delay: 0.25s; }
.spco-mobile-menu.open .mobile-menu-links li:nth-child(6) a { transition-delay: 0.30s; }

.mobile-menu-links a:hover {
  color: var(--ink);
  padding-left: 0.5rem;
}
/* Small accent dot */
.mobile-menu-links a::before {
  content: '·';
  margin-right: 0.6rem;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.2s;
}
.mobile-menu-links a:hover::before { opacity: 1; }

/* Mobile menu bottom: lang + orb */
.mobile-menu-footer {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s 0.35s var(--ease-ink),
              transform 0.4s 0.35s var(--ease-ink);
}
.spco-mobile-menu.open .mobile-menu-footer {
  opacity: 1;
  transform: translateY(0);
}
.mobile-lang-row {
  display: flex;
  gap: 0.8rem;
}
.mobile-lang-btn {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  border: 1px solid rgba(26,26,26,0.15);
  border-radius: 3px;
  background: transparent;
  color: rgba(26,26,26,0.5);
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}
.mobile-lang-btn:hover,
.mobile-lang-btn.active {
  background: var(--ink);
  color: var(--rice);
  border-color: var(--ink);
}
.mobile-login-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: rgba(26,26,26,0.4);
  text-decoration: none;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: color 0.2s;
}
.mobile-login-link:hover { color: var(--ink); }

/* ════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
════════════════════════════════════════════ */
@media (max-width: 781px) {
  .spco-nav-links  { display: none !important; }
  .spco-orb-btn    { display: none !important; }
  .spco-burger     { display: flex !important; }
  /* overlay 在 mobile 下始终 display:flex，开关只靠 visibility+opacity */
  .spco-mobile-menu { display: flex !important; }
}
@media (min-width: 782px) {
  .spco-burger      { display: none !important; }
  /* desktop 下彻底隐藏，连 visibility 也不管用，直接 display:none */
  .spco-mobile-menu { display: none !important; visibility: hidden !important; }
}
`;

/* ─────────────────────────────────────────────
   CONCENTRIC CIRCLE SVG (水墨同心圆)
   Ink-wash style with organic, slightly
   imperfect rings — like brushed concentric
   ripples on paper.
───────────────────────────────────────────── */
const ORB_SVG = `
<img src="./assets/images/settings.png" alt="settings">
`;

/* ─────────────────────────────────────────────
   BRAND SVG: 華樂 in Zhi Mang Xing
   (Inline text — fallback gracefully)
───────────────────────────────────────────── */
function buildBrandHTML(lang) {
  // The full title collapses on scroll:
  // [ 新加坡理工学院 ][ 華樂(logo) ][ 团 ]
  return `
  <a href="index.html" class="spco-brand" aria-label="新加坡理工学院華樂团">
    <span class="brand-prefix" aria-hidden="false">新加坡理工学院</span>
    <span class="brand-logo-wrap">
      <img src="./assets/images/spco.png" alt="SPCO-logo" style=" max-height: 30px !important; max-width: 30px !important;">
    </span>
    <span class="brand-suffix">团</span>
  </a>`;
}

/* ─────────────────────────────────────────────
   I18N LABELS (minimal, navbar scope)
   Full i18n.js will extend this later.
───────────────────────────────────────────── */
const NAV_LABELS = {
  en: {
    home:       'Home',
    sectional:  'Sections',
    news:       'News',
    works:      'Works',
    lang:       'Language',
    login:      'Member Login',
    profile:    'My Profile',
    settings:   'Settings',
  },
  zh: {
    home:       '主页',
    sectional:  '分部',
    news:       '消息',
    works:      '作品',
    lang:       '语言',
    login:      '成员登录',
    profile:    '我的主页',
    settings:   '设置',
  }
};

/* ─────────────────────────────────────────────
   WEB COMPONENT
───────────────────────────────────────────── */
class SPCONavbar extends HTMLElement {

  connectedCallback() {
    this._lang = this.dataset.lang
      || localStorage.getItem('spco_lang')
      || document.documentElement.getAttribute('data-lang')
      || 'en';

    this._popoverOpen = false;
    this._mobileOpen  = false;
    this._scrolled    = false;

    this._injectStyles();
    this._render();
    this._bind();
    this._initScroll();
  }

  /* ── Inject <style> once into <head> ── */
  _injectStyles() {
    if (document.getElementById('spco-navbar-css')) return;
    const s = document.createElement('style');
    s.id = 'spco-navbar-css';
    s.textContent = NAVBAR_CSS;
    document.head.appendChild(s);
  }

  /* ── Build DOM ── */
  _render() {
    const t  = NAV_LABELS[this._lang] || NAV_LABELS.en;
    const links = [
      { label: t.home,      href: 'index.html',     key: 'home' },
      { label: t.sectional, href: 'sectional.html',  key: 'sectional' },
      { label: t.news,      href: 'news.html',       key: 'news' },
      { label: t.works,     href: 'works.html',      key: 'works' },
    ];

    const cur = location.pathname.split('/').pop() || 'index.html';

    const navLinkItems = links.map((l, i) => {
      const isActive = cur === l.href || (cur === '' && l.href === 'index.html');
      // 修改这里：将 i === 0 替换为 isActive
      return `<li${isActive ? ' class="has-active-bar"' : ''}>
        <a href="${l.href}"
           class="${isActive ? 'active' : ''}"
           data-nav-key="${l.key}">${l.label}</a>
      </li>`;
    }).join('');

    /* ── Orb popover ── */
    const popoverHTML = `
    <div class="spco-orb-popover" id="spco-orb-popover" role="dialog" aria-label="Options"
        <p class="popover-section-label">${t.lang}</p>
        <div class="popover-lang-row">
          <button class="popover-lang-btn${this._lang === 'en'      ? ' active' : ''}" data-lang="en">EN</button>
          <button class="popover-lang-btn${this._lang === 'zh'      ? ' active' : ''}" data-lang="zh">简中</button>
          <button class="popover-lang-btn${this._lang === 'zh-hant' ? ' active' : ''}" data-lang="zh-hant">繁中</button>
        </div>

      <div class="popover-divider"></div>
      <p class="popover-section-label">${t.account ?? 'Account'}</p>

      <a href="login.html" class="popover-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span class="popover-link-text">
          <span class="popover-link-main">${t.login}</span>
          <span class="popover-link-sub">login.html</span>
        </span>
      </a>

      <a href="profile.html" class="popover-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="popover-link-text">
          <span class="popover-link-main">${t.profile}</span>
          <span class="popover-link-sub">profile.html</span>
        </span>
      </a>

      <div class="popover-divider"></div>

      <a href="settings.html" class="popover-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span class="popover-link-text">
          <span class="popover-link-main">${t.settings}</span>
          <span class="popover-link-sub">settings.html</span>
        </span>
      </a>

    </div>`;

    /* ── Mobile fullscreen menu ── */
    const mobileMenuHTML = `
    <div class="spco-mobile-menu" id="spco-mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation Menu">
      <ul class="mobile-menu-links">
        ${links.map(l => `
        <li>
          <a href="${l.href}" data-nav-key="${l.key}">${l.label}</a>
        </li>`).join('')}
      </ul>
      <div class="mobile-menu-footer">
        <div class="mobile-lang-row">
          <button class="mobile-lang-btn${this._lang === 'en'     ? ' active' : ''}" data-mobile-lang="en">EN</button>
          <button class="mobile-lang-btn${this._lang === 'zh'     ? ' active' : ''}" data-mobile-lang="zh">简中</button>
          <button class="mobile-lang-btn${this._lang === 'zh-hant'? ' active' : ''}" data-mobile-lang="zh-hant">繁中</button>
        </div>
        <a href="login.html" class="mobile-login-link">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          ${t.login}
        </a>
      </div>
    </div>`;

    /* ── Full HTML ── */
    this.id = 'spco-nav';
    this.setAttribute('role', 'navigation');
    this.innerHTML = `
      <div class="spco-nav-inner">
        ${buildBrandHTML(this._lang)}

        <div style="position:relative; display:flex; align-items:center; gap: 2rem; flex-direction: row;">
        <ul class="spco-nav-links" id="spco-nav-links">
          ${navLinkItems}
        </ul>
        
        <!-- Desktop: Orb -->
        <div style="">
          <button class="spco-orb-btn" id="spco-orb-btn"
                  aria-label="Options" aria-expanded="false" aria-haspopup="dialog">
            ${ORB_SVG}
          </button>
          ${popoverHTML}
        </div>
        </div>


        <!-- Mobile: Burger -->
        <button class="spco-burger" id="spco-burger"
                aria-label="Toggle menu" aria-expanded="false">
          <svg viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg" fill="none">
            <line class="burger-line bl-top" x1="0" y1="3"  x2="24" y2="3"/>
            <line class="burger-line bl-mid" x1="0" y1="9"  x2="24" y2="9"/>
            <line class="burger-line bl-bot" x1="0" y1="15" x2="24" y2="15"/>
          </svg>
        </button>
      </div>
      ${mobileMenuHTML}
    `;
  }

  /* ── Scroll: add .nav-scrolled ── */
  _initScroll() {
    const onScroll = () => {
      const past = window.scrollY > 40;
      if (past !== this._scrolled) {
        this._scrolled = past;
        this.classList.toggle('nav-scrolled', past);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  /* ── Event bindings ── */
  _bind() {
    // document 级别的 listener 只挂一次，用 flag 保护
    if (!this._docListenersBound) {
      this._docListenersBound = true;

      document.addEventListener('click', (e) => {
        if (!this.contains(e.target)) this._closePopover();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { this._closePopover(); this._closeMobile(); }
      });
    }

    // 以下每次 _render 后重新绑（因为 DOM 被整个替换了）
    const orbBtn  = this.querySelector('#spco-orb-btn');
    const popover = this.querySelector('#spco-orb-popover');
    const burger  = this.querySelector('#spco-burger');
    const mobileM = this.querySelector('#spco-mobile-menu');

    orbBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._popoverOpen = !this._popoverOpen;
      popover.classList.toggle('open', this._popoverOpen);
      orbBtn.setAttribute('aria-expanded', this._popoverOpen);
      const ring = orbBtn.querySelector('.orb-accent-ring');
      if (ring) ring.style.opacity = this._popoverOpen ? '0.5' : '0';
    });

    this.querySelectorAll('.popover-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this._switchLang(btn.dataset.lang));
    });

    burger.addEventListener('click', () => {
      this._mobileOpen = !this._mobileOpen;
      burger.classList.toggle('open', this._mobileOpen);
      mobileM.classList.toggle('open', this._mobileOpen);
      burger.setAttribute('aria-expanded', this._mobileOpen);
      if (this._mobileOpen) {
        this._scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this._scrollY}px`;
        document.body.style.width = '100%';
      } else {
        this._restoreScroll();
      }
    });

    this.querySelectorAll('.mobile-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this._switchLang(btn.dataset.mobileLang));
    });

    this.querySelectorAll('.mobile-menu-links a').forEach(a => {
      a.addEventListener('click', () => this._closeMobile());
    });
  }

  /* ── Lang switch ── */
  _switchLang(lang) {
    if (!NAV_LABELS[lang]) return;
    this._lang = lang;
    localStorage.setItem('spco_lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    // 只更新 navbar 内部文字，不整个 re-render（避免 listener 爆炸）
    this._updateNavLabels(lang);

    // 调 index.html 里的 switchLang（名字对上）
    if (typeof window.switchLang === 'function') {
      window.switchLang(lang);
    }

    // 同时 fire event，方便未来 i18n.js 接
    document.dispatchEvent(new CustomEvent('spco:langchange', { detail: { lang } }));
  }

  /* ── 只更新文字，不重建 DOM ── */
  _updateNavLabels(lang) {
    const t = NAV_LABELS[lang] || NAV_LABELS.en;

    // nav links
    this.querySelectorAll('[data-nav-key]').forEach(el => {
      const key = el.getAttribute('data-nav-key');
      if (t[key]) el.textContent = t[key];
    });

    // lang buttons active state（popover + mobile）
    this.querySelectorAll('.popover-lang-btn, .mobile-lang-btn').forEach(btn => {
      const btnLang = btn.dataset.lang || btn.dataset.mobileLang;
      btn.classList.toggle('active', btnLang === lang);
    });
  }

  _restoreScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, this._scrollY || 0);
  }

  _closePopover() {
    this._popoverOpen = false;
    const p = this.querySelector('#spco-orb-popover');
    const b = this.querySelector('#spco-orb-btn');
    if (p) p.classList.remove('open');
    if (b) {
      b.setAttribute('aria-expanded', 'false');
      const ring = b.querySelector('.orb-accent-ring');
      if (ring) ring.style.opacity = '0';
    }
  }

  _closeMobile() {
    this._mobileOpen = false;
    const burger = this.querySelector('#spco-burger');
    const menu   = this.querySelector('#spco-mobile-menu');
    if (burger) { burger.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    if (menu)   menu.classList.remove('open');
    this._restoreScroll();
  }
}

customElements.define('spco-navbar', SPCONavbar);
