import { useSyncExternalStore } from "react";
import { initialState } from "@/data/seed";
import type { AppState } from "@/lib/types";

/**
 * In-session data store.
 *
 * This is the single seam that a real backend replaces: swap these read/write
 * helpers for Supabase queries (Auth + PostgreSQL + Storage) and every service
 * in `src/services/*` keeps its current interface.
 */
const STORAGE_KEY = "DNK-state-v1";

let state: AppState = initialState;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getState = () => state;

export const setState = (updater: (prev: AppState) => AppState) => {
  state = updater(state);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — session-only state is fine for the prototype */
    }
  }
  emit();
};

export const hydrateFromStorage = () => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as AppState;
    if (parsed && Array.isArray(parsed.products)) {
      state = parsed;
      emit();
    }
  } catch {
    /* ignore malformed cache */
  }
};

export const resetDemoData = () => {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  state = initialState;
  emit();
};

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    getState,
    () => initialState,
  );
}

export const delay = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

export const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

