import { useSyncExternalStore } from "react";

const STORAGE_KEY_LANG = "dnk-language";
const STORAGE_KEY_CURR = "dnk-currency";

export type SupportedLanguage = "en" | "hi" | "gu" | "fr";
export type SupportedCurrency = "USD" | "INR" | "EUR" | "GBP";

interface PreferencesState {
  language: SupportedLanguage;
  currency: SupportedCurrency;
}

const getInitialState = (): PreferencesState => {
  if (typeof window === "undefined") {
    return { language: "en", currency: "USD" };
  }
  return {
    language: (window.localStorage.getItem(STORAGE_KEY_LANG) as SupportedLanguage) || "en",
    currency: (window.localStorage.getItem(STORAGE_KEY_CURR) as SupportedCurrency) || "USD",
  };
};

let state: PreferencesState = getInitialState();
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getState = () => state;

export const setLanguage = (lang: SupportedLanguage) => {
  state = { ...state, language: lang };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY_LANG, lang);
  }
  emit();
};

export const setCurrency = (curr: SupportedCurrency) => {
  state = { ...state, currency: curr };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY_CURR, curr);
  }
  emit();
};

export function usePreferences(): PreferencesState {
  return useSyncExternalStore(subscribe, getState, () => ({ language: "en", currency: "USD" }));
}
