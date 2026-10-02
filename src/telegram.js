/** Обёртка над Telegram WebApp API (безопасно работает и вне Telegram) */

const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
let mainButtonHandler = null;

export function initTelegram() {
  if (!tg) return null;
  try {
    tg.ready();
    tg.expand();
    // Бренд Бубер 3D: фиксируем свою палитру, не подмешиваем тему Telegram
    if (tg.setHeaderColor) {
      try {
        tg.setHeaderColor('#0a0a0a');
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
        tg.setBackgroundColor('#0a0a0a');
      } catch (_) {
        /* ignore */
      }
    }
    if (tg.MainButton?.setParams) {
      try {
        tg.MainButton.setParams({
          color: '#ff8a1f',
          text_color: '#0a0a0a',
        });
      } catch (_) {
        /* ignore */
      }
    }
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
