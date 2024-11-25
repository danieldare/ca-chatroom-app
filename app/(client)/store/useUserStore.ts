import { create } from "zustand";
import cookies from "js-cookie";

interface User {
  id: number;
  username: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  initializeUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  initializeUser: () => {
    const userCookie = cookies.get("user");
    if (userCookie) {
      const user = JSON.parse(userCookie);
      set({ user });
    }
  },
}));
