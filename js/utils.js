window.WD_UTILS = {
  qs(selector, root = document) {
    return root.querySelector(selector);
  },

  qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  },

  safeText(value, fallback = '') {
    if (value === null || value === undefined) return fallback;
    return String(value);
  },

  escapeHTML(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  },

  formatDate(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },

  initials(name = '') {
    return String(name)
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() || '')
      .join('') || 'WD';
  },

  setHTML(selector, html, root = document) {
    const node = typeof selector === 'string' ? root.querySelector(selector) : selector;
    if (!node) return false;
    node.innerHTML = html;
    return true;
  },

  setText(selector, text, root = document) {
    const node = typeof selector === 'string' ? root.querySelector(selector) : selector;
    if (!node) return false;
    node.textContent = text;
    return true;
  },

  show(selector, display = 'block', root = document) {
    const node = typeof selector === 'string' ? root.querySelector(selector) : selector;
    if (!node) return false;
    node.style.display = display;
    return true;
  },

  hide(selector, root = document) {
    const node = typeof selector === 'string' ? root.querySelector(selector) : selector;
    if (!node) return false;
    node.style.display = 'none';
    return true;
  },

  byData(key, value, root = document) {
    return root.querySelector(`[data-${key}="${value}"]`);
  },

  toast(message) {
    if (window.WD_CONFIG?.DEBUG) console.log('[WD]', message);
    alert(message);
  }
};
