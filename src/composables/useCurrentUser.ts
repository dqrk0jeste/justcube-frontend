import { useSessionStore } from "@/stores/session";
import { storeToRefs } from "pinia";

export function useCurrentUser() {
  const sessionStore = useSessionStore()
  const { user } = storeToRefs(sessionStore)
  return user
}