"use client";
import { create } from "zustand";
import { getJWT, removeJWT, fetchDataViaGet } from "#/api/utils";

interface userState {
  isAuth: boolean
  user: Object | null
  token: string | null
  login: (user: Object, token: string) => void
  logout: () => void
  checkAuth: () => void
}

export const useUserStore = create<userState>((set, get) => ({
  isAuth: false,
  user: null,
  token: null,

  login: (user: Object, token: string) => {
    set({ isAuth: true, user: user, token: token });
  },
  logout: () => {
    set({ isAuth: false, user: null, token: null });
    removeJWT();
  },
  checkAuth: async () => {
    const jwt = getJWT();
    if (jwt) {
      const data = await fetchDataViaGet(
        `/api/profile/${jwt.user_id}?token=${jwt.jwt}`
      );
      if (data && data.is_my_profile) {
        get().login(data.profile, jwt.jwt);
      } else {
        get().logout();
      }
    } else {
      get().logout();
    }
  },
}));
