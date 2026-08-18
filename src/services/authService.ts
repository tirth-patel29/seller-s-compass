import { delay, getState, setState } from "./db";
import type { Role, User } from "@/lib/types";

/**
 * Auth service. Replace with Supabase Auth (`supabase.auth.signInWithPassword`)
 * without changing callers.
 */
export const authService = {
  async loginAs(role: Role): Promise<User> {
    await delay(350);
    const user = getState().users.find((u) => u.role === role);
    if (!user) throw new Error("No demo account available for this role.");
    setState((s) => ({ ...s, currentUserId: user.id }));
    return user;
  },

  async logout(): Promise<void> {
    await delay(150);
    setState((s) => ({ ...s, currentUserId: null }));
  },

  getCurrentUser(): User | null {
    const s = getState();
    return s.users.find((u) => u.id === s.currentUserId) ?? null;
  },
};

export const currentUserFrom = (
  users: User[],
  currentUserId: string | null,
): User | null => users.find((u) => u.id === currentUserId) ?? null;
