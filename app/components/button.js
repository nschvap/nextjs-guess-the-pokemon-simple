"use client";

import axios from "axios";
import { usePokemonStore } from "@/stores/pokemon-store";
import { getRandomNumber } from "../lib/functions";

const PlayBtn = () => {
  const { setPokemon } = usePokemonStore((store) => store);

  const startGame = async () => {
    const number = getRandomNumber();
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${number}`
    );

    setPokemon(data);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="font-light text-2xl lg:text-4xl md:text-3xl text-white">Guess The Pokemon</h1>
      <button
        onClick={startGame}
        className="px-3 py-1 text-xl bg-red-500 font-black rounded-lg text-white mt-3"
      >
        Play
      </button>
    </div>
  );
};

export default PlayBtn;
