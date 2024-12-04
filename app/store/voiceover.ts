"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface voiceoverState {
    preferences: Map<number, string>;
    getPreferredVoiceover: (id: number) => (string | undefined);
    setPreferredVoiceover: (id: number, voiceover: string) => void;
}

export const useVoiceoverStore = create<voiceoverState>()(
    persist(
        (set, get) => ({
            preferences: new Map<number, string>(),
            getPreferredVoiceover: (id: number) => get().preferences[id],
            setPreferredVoiceover: (id: number, voiceover: string) => {
                let current = get().preferences
                current[id] = voiceover
                set({
                    preferences: current,
                });
            },
        }),
        {
            name: "voiceover-preferences",
        }
    )
);