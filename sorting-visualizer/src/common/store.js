import create from "zustand";
import { devtools } from "zustand/middleware";
import { sortingArray, compareTime, swapTime, sortingAlgorithms } from "./config";

const THEME_STORAGE_KEY = "sorting_visualizer_theme";

function getInitialThemeMode() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function persistThemeMode(themeMode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }
}

export const useData = create(
  devtools((set) => ({
    algorithm: 0,
    sortingArray: sortingArray,
    setSortingArray: (array) => set({ sortingArray: array }),
    setAlgorithm: (idx) => set({ algorithm: idx }),
  }))
);

export const useControls = create(
  devtools((set) => ({
    progress: "reset",
    speed: 3,
    compareTime: compareTime,
    swapTime: swapTime,
    doneCount: 0,
    themeMode: getInitialThemeMode(),

    startSorting: () => set({ progress: "start" }),
    pauseSorting: () => set({ progress: "pause" }),
    resetSorting: () => set({ progress: "reset", doneCount: 0 }),
    markSortngDone: () =>
      set((state) => {
        if (useData.getState().algorithm === sortingAlgorithms.length) {
          if (state.doneCount === sortingAlgorithms.length - 1)
            return { doneCount: 0, progress: "done" };
          else return { doneCount: state.doneCount + 1 };
        }
        return { progress: "done" };
      }),
    setSpeed: (speed) =>
      set(() => {
        return { swapTime: 3000 / speed, compareTime: 1500 / speed, speed };
      }),
    setThemeMode: (themeMode) =>
      set(() => {
        persistThemeMode(themeMode);
        return { themeMode };
      }),
    toggleThemeMode: () =>
      set((state) => {
        const nextThemeMode = state.themeMode === "dark" ? "light" : "dark";
        persistThemeMode(nextThemeMode);
        return { themeMode: nextThemeMode };
      }),
  }))
);
