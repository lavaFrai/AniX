"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface preferencesState {
  _hasHydrated: boolean;
  flags: {
    // saveSearchHistory: boolean;
    saveWatchHistory: boolean;
    // theme: "light" | "dark" | "black" | "system";
  };
  params: {
    isFirstLaunch: boolean;
    // color: {
    //   primary: string;
    //   secondary: string;
    //   accent: string;
    // }
  };
  setHasHydrated: (state: boolean) => void;
  setFlags: (flags: preferencesState["flags"]) => void;
  setParams: (params: preferencesState["params"]) => void;
}

export const usePreferencesStore = create<preferencesState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      flags: {
        // saveSearchHistory: true,
        saveWatchHistory: true,
        // theme: "light",
      },
      params: {
        isFirstLaunch: true,
      },
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
      setFlags(flags) {
        set({ flags });
      },
      setParams(params) {
        set({ params });
      },
    }),
    {
      name: "preferences",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
