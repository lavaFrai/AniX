"use client";
import { create } from "zustand";
import { getJWT, setJWT, removeJWT, fetchDataViaGet } from "@/app/api/utils";

export const useUserStore = create((set, get) => ({
  isAuth: false,
  user: null,
  token: null,

  login: (user, token) => {
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
