import { storageGet, storageSet } from './utils.js';

const ERROR_LOG_KEY = 'error-log';
const MAX_ERRORS = 50;

function formatError(error, context = {}) {
  return {
    message: error.message || String(error),
    stack: error.stack || null,
    name: error.name || 'Error',
    url: window.location.href,
    timestamp: new Date().toISOString(),
    context
  };
}

function saveError(errorEntry) {
  const log = storageGet(ERROR_LOG_KEY) || [];
  log.push(errorEntry);
  if (log.length > MAX_ERRORS) {
    log.splice(0, log.length - MAX_ERRORS);
  }
  storageSet(ERROR_LOG_KEY, log);
}

export function logError(error, context = {}) {
  const entry = formatError(error, context);
  console.error(`[ErrorTracker] ${entry.message}`, entry);
  saveError(entry);
}

export function logWarning(message, context = {}) {
  const entry = {
    level: 'warning',
    message,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    context
  };
  console.warn(`[ErrorTracker] ${message}`, entry);
  saveError(entry);
}

export function getErrorLog() {
  return storageGet(ERROR_LOG_KEY) || [];
}

export function clearErrorLog() {
  storageSet(ERROR_LOG_KEY, []);
}

export function initErrorTracking() {
  window.addEventListener('error', (e) => {
    logError(e.error || new Error(e.message), {
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    const err = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
    logError(err, { type: 'unhandledrejection' });
  });
}
