/** Обёртка над Telegram WebApp API (безопасно работает и вне Telegram) */

const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
let mainButtonHandler = null;
let backButtonHandler = null;

const THEME_CHROME = {
  light: '#f7f5f2',
  dark: '#0a0a0a',
};

/** Синхронизация header/bg Telegram с нашей темой. MainButton остаётся оранжевым. */
export function applyTelegramChrome(theme = 'light') {
  if (!tg) return;
  const color = THEME_CHROME[theme] || THEME_CHROME.light;
  if (tg.setHeaderColor) {
    try {
      tg.setHeaderColor(color);
    } catch (_) {
      try {
        tg.setHeaderColor('bg_color');
      } catch (__) {
        /* ignore older clients */
      }
    }
  }
  if (tg.setBackgroundColor) {
    try {
      tg.setBackgroundColor(color);
    } catch (_) {
      /* ignore */
    }
  }
  if (tg.MainButton?.setParams) {
    try {
      tg.MainButton.setParams({
        color: '#ff8a1f',
        text_color: '#ffffff',
      });
    } catch (_) {
      /* ignore */
    }
  }
}

export function initTelegram(theme = 'light') {
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    applyTelegramChrome(theme);
  } catch (e) {
    console.warn('Telegram init:', e);
  }
  return tg;
}

export function applyTheme(params = {}) {
  const root = document.documentElement;
  const map = {
    bg_color: '--tg-bg',
    text_color: '--tg-text',
    hint_color: '--tg-hint',
    link_color: '--tg-link',
    button_color: '--tg-button',
    button_text_color: '--tg-button-text',
    secondary_bg_color: '--tg-secondary-bg',
  };
  Object.entries(map).forEach(([key, cssVar]) => {
    if (params[key]) root.style.setProperty(cssVar, params[key]);
  });
}

export function getTelegram() {
  return tg || null;
}

export function showMainButton(text, onClick) {
  if (!tg?.MainButton) return false;
  if (mainButtonHandler && tg.MainButton.offClick) {
    try {
      tg.MainButton.offClick(mainButtonHandler);
    } catch (_) {
      /* ignore */
    }
  }
  mainButtonHandler = onClick;
  tg.MainButton.setText(text);
  tg.MainButton.onClick(mainButtonHandler);
  tg.MainButton.show();
  tg.MainButton.enable();
  return true;
}

export function hideMainButton() {
  if (!tg?.MainButton) return;
  if (mainButtonHandler && tg.MainButton.offClick) {
    try {
      tg.MainButton.offClick(mainButtonHandler);
    } catch (_) {
      /* ignore */
    }
  }
  mainButtonHandler = null;
  tg.MainButton.hide();
}

export function showBackButton(onClick) {
  if (!tg?.BackButton) return false;
  if (backButtonHandler && tg.BackButton.offClick) {
    try {
      tg.BackButton.offClick(backButtonHandler);
    } catch (_) {
      /* ignore */
    }
  }
  backButtonHandler = onClick;
  tg.BackButton.onClick(backButtonHandler);
  tg.BackButton.show();
  return true;
}

export function hideBackButton() {
  if (!tg?.BackButton) return;
  if (backButtonHandler && tg.BackButton.offClick) {
    try {
      tg.BackButton.offClick(backButtonHandler);
    } catch (_) {
      /* ignore */
    }
  }
  backButtonHandler = null;
  tg.BackButton.hide();
}

export function haptic(type = 'light') {
  try {
    tg?.HapticFeedback?.impactOccurred?.(type);
  } catch (_) {
    /* ignore */
  }
}

export function getUser() {
  return tg?.initDataUnsafe?.user || null;
}
