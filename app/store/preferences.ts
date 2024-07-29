"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const usePreferencesStore = create(
  persist(
    (set, get) => ({
    }),
    {
      name: "preferences",
    }
  )
);
