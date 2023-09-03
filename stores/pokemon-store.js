import { create } from "zustand";

export const usePokemonStore = create((set) => ({
  pokemon: {},
  setPokemon: (data) => set(() => ({ pokemon: data })),
}));
