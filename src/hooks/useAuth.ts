import { useAppState } from "@/services/db";
import type { Role, User } from "@/lib/types";

export function useAuth(): { user: User | null; isRole: (r: Role) => boolean } {
  const state = useAppState();
  const user = state.users.find((u) => u.id === state.currentUserId) ?? null;
  return { user, isRole: (r) => user?.role === r };
}
