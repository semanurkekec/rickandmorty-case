import { create } from "zustand";
interface State {
  selection: Set<number>;
}
interface Action {
  addToSelection: (id: number) => void;
  removeFromSelection: (id: number) => void;
}
export const store = create<State & Action>((set) => ({
  selection: new Set<number>(),
  addToSelection: (id: number) =>
    set((state) => {
      const selection = state.selection;
      selection.add(id);
      return { selection: new Set(selection) };
    }),
  removeFromSelection: (id: number) =>
    set((state) => {
      state.selection.delete(id);
      return { selection: new Set(state.selection) };
    }),
}));

export function useSelection() {
  return store((state) => state);
}
