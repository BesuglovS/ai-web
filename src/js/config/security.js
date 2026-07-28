import { STORAGE_PREFIX } from './constants.js';

export const safeLocalStorage = {
  get(key) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn(`[security] Ошибка чтения localStorage ключ "${key}":`, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[security] Ошибка записи localStorage ключ "${key}":`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (e) {
      console.warn(`[security] Ошибка удаления localStorage ключ "${key}":`, e);
      return false;
    }
  }
};
