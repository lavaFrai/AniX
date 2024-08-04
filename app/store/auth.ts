"use client";
import { create } from "zustand";
import { getJWT, removeJWT, fetchDataViaGet } from "#/api/utils";

interface userState {
  isAuth: boolean
  user: Object | null
  token: string | null
  state: string,
  login: (user: Object, token: string) => void
  logout: () => void
  checkAuth: () => void
}

export const useUserStore = create<userState>((set, get) => ({
  isAuth: false,
  user: null,
  token: null,
  state: "loading",

  login: (user: Object, token: string) => {
    set({ isAuth: true, user: user, token: token, state: "finished" });
  },
  logout: () => {
    set({ isAuth: false, user: null, token: null, state: "finished" });
    removeJWT();
  },
  checkAuth: () => {
    const jwt = getJWT();
    if (jwt) {
      const _checkAuth = async () => {
        const data = await fetchDataViaGet(
          `/api/profile/${jwt.user_id}?token=${jwt.jwt}`
        );
        if (data && data.is_my_profile) {
          get().login(data.profile, jwt.jwt);
        } else {
          get().logout();
        }
      }
      _checkAuth()
    } else {
      get().logout();
    }
  },
}));
