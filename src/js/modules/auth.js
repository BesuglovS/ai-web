import { AUTH_SERVICE_URL, STORAGE_PREFIX } from '../config/constants.js';
import { qs, on, createEl, storageGet, storageSet, storageRemove } from './utils.js';
import { checkAuth } from './api-client.js';

let currentUser = null;

function getToken() {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + 'auth-token');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    localStorage.setItem(STORAGE_PREFIX + 'auth-token', JSON.stringify(token));
  } catch {}
}

function removeToken() {
  try {
    localStorage.removeItem(STORAGE_PREFIX + 'auth-token');
  } catch {}
}

function setUser(user) {
  currentUser = user;
  storageSet('auth-user', user);
}

function getSavedUser() {
  return storageGet('auth-user');
}

function renderUserInfo(user) {
  const container = qs('.auth-container');
  if (!container) return;
  container.innerHTML = '';

  if (user) {
    const info = createEl('div', { className: 'auth-user-info' });
    const avatar = createEl('img', {
      className: 'auth-avatar',
      src: user.avatar || '',
      alt: user.name || ''
    });
    if (!user.avatar) avatar.style.display = 'none';

    const name = createEl('span', { className: 'auth-user-name', textContent: user.name || user.email });
    const logoutBtn = createEl('button', {
      className: 'btn btn-outline auth-logout-btn',
      textContent: 'Выйти'
    });

    info.appendChild(avatar);
    info.appendChild(name);
    info.appendChild(logoutBtn);
    container.appendChild(info);

    on(logoutBtn, 'click', logout);
  } else {
    const loginBtn = createEl('button', {
      className: 'btn btn-primary auth-login-btn',
      textContent: 'Войти'
    });
    container.appendChild(loginBtn);
    on(loginBtn, 'click', openLoginModal);
  }
}

function openLoginModal() {
  let modal = qs('.auth-modal');
  if (!modal) {
    modal = createEl('div', { className: 'auth-modal', role: 'dialog', 'aria-modal': 'true' });
    const overlay = createEl('div', { className: 'auth-modal-overlay' });
    const dialog = createEl('div', { className: 'auth-modal-dialog' });

    const title = createEl('h2', { className: 'auth-modal-title', textContent: 'Вход в систему' });
    const desc = createEl('p', {
      className: 'auth-modal-desc',
      textContent: 'Вы будете перенаправлены на сайт авторизации Nayanova Academy'
    });
    const actions = createEl('div', { className: 'auth-modal-actions' });
    const confirmBtn = createEl('button', {
      className: 'btn btn-primary',
      textContent: 'Перейти к входу'
    });
    const cancelBtn = createEl('button', {
      className: 'btn btn-outline',
      textContent: 'Отмена'
    });
    const closeBtn = createEl('button', {
      className: 'auth-modal-close',
      textContent: '✕',
      'aria-label': 'Закрыть'
    });

    actions.appendChild(confirmBtn);
    actions.appendChild(cancelBtn);
    dialog.appendChild(closeBtn);
    dialog.appendChild(title);
    dialog.appendChild(desc);
    dialog.appendChild(actions);
    modal.appendChild(overlay);
    modal.appendChild(dialog);
    document.body.appendChild(modal);

    on(closeBtn, 'click', closeLoginModal);
    on(overlay, 'click', closeLoginModal);
    on(cancelBtn, 'click', closeLoginModal);
    on(confirmBtn, 'click', () => {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `${AUTH_SERVICE_URL}/login?return=${returnUrl}`;
    });
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') closeLoginModal();
    });
  }
  modal.classList.add('active');
}

function closeLoginModal() {
  const modal = qs('.auth-modal');
  if (modal) modal.classList.remove('active');
}

async function logout() {
  removeToken();
  storageRemove('auth-user');
  currentUser = null;
  renderUserInfo(null);
}

async function initAuth() {
  const savedUser = getSavedUser();
  if (savedUser) {
    currentUser = savedUser;
  }

  renderUserInfo(currentUser);

  const token = getToken();
  if (token) {
    try {
      const result = await checkAuth();
      if (result.authenticated && result.user) {
        setUser(result.user);
        renderUserInfo(result.user);
      } else {
        removeToken();
        storageRemove('auth-user');
        currentUser = null;
        renderUserInfo(null);
      }
    } catch {
      renderUserInfo(currentUser);
    }
  }
}

export { initAuth, getCurrentUser, openLoginModal, closeLoginModal, logout };

function getCurrentUser() {
  return currentUser;
}
