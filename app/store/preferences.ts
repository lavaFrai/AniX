"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface preferencesState {
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
  setFlags: (flags: preferencesState["flags"]) => void;
  setParams: (params: preferencesState["params"]) => void;
}

export const usePreferencesStore = create<preferencesState>()(
  persist(
    (set, get) => ({
      flags: {
        // saveSearchHistory: true,
        saveWatchHistory: true,
        // theme: "light",
      },
      params: {
        isFirstLaunch: true,
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
    }
  )
);
