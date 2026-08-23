/**
 * Safe, Versioned UI Preference Storage
 * Protects against malformed JSON, legacy cache mismatches, and schema migrations.
 * Never executes destructive localStorage.clear().
 */

export const PREFERENCE_STORAGE_VERSION = 3;

/**
 * Safely retrieve a UI preference from localStorage
 */
export function getUiPreference(key, defaultValue = null, version = PREFERENCE_STORAGE_VERSION) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultValue;
  }

  const namespacedKey = key.startsWith('nec:ui:') ? key : `nec:ui:${key}`;

  try {
    const raw = localStorage.getItem(namespacedKey);
    if (!raw) return defaultValue;

    const parsed = JSON.parse(raw);

    // Schema version validation
    if (parsed && typeof parsed === 'object' && parsed._v !== undefined) {
      if (parsed._v !== version) {
        // Discard outdated cache version safely
        localStorage.removeItem(namespacedKey);
        return defaultValue;
      }
      return parsed.data !== undefined ? parsed.data : defaultValue;
    }

    return parsed !== undefined ? parsed : defaultValue;
  } catch (err) {
    console.warn(`[PreferenceStorage] Corrupt preference in ${namespacedKey}, auto-recovering:`, err);
    try {
      localStorage.removeItem(namespacedKey);
    } catch {}
    return defaultValue;
  }
}

/**
 * Safely persist a UI preference to localStorage
 */
export function setUiPreference(key, value, version = PREFERENCE_STORAGE_VERSION) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const namespacedKey = key.startsWith('nec:ui:') ? key : `nec:ui:${key}`;

  try {
    const payload = {
      _v: version,
      _t: Date.now(),
      data: value
    };
    localStorage.setItem(namespacedKey, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[PreferenceStorage] Failed to save preference for ${namespacedKey}:`, err);
  }
}

/**
 * Discards ONLY namespaced UI preferences (Never wipes auth, tokens, or server sessions!)
 */
export function resetUiPreferences() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('nec:ui:') || k.startsWith('nec:view:') || k.startsWith('nec_table_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    console.info(`[PreferenceStorage] Cleaned ${keysToRemove.length} cached UI preferences.`);
  } catch (e) {
    console.error('[PreferenceStorage] Error resetting preferences:', e);
  }
}
