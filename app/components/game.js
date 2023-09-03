"use client";

import { usePokemonStore } from "@/stores/pokemon-store";
import PlayBtn from "./button";
import Image from "next/image";
import { useState } from "react";
import { getRandomNumber } from "../lib/functions";
import axios from "axios";
import Spinner from "./spinner";

const Game = () => {
  const [pokemon, setPokemon] = usePokemonStore((store) => [
    store.pokemon,
    store.setPokemon,
  ]);
  const [guessed, setGuessed] = useState(false);
  const [endState, setEndState] = useState(0);
  const [guess, setGuess] = useState("");
  const [reloading, setReloading] = useState(false);

  const fetchAnotherPokemon = async () => {
    const number = getRandomNumber();
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${number}`
    );

    setPokemon(data);
    setReloading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim().length < 1) return;

    setGuessed(true);
    if (guess.toLowerCase() === pokemon.name.toLowerCase()) {
      setEndState(1);
    } else {
      setEndState(2);
    }
  };

  const restartGame = () => {
    setGuessed(false);
    setGuess("");
    setEndState(0);

    setReloading(true);
    fetchAnotherPokemon();
  };

  if (reloading) return <Spinner />;

  return pokemon.name ? (
    <article className="w-full px-5 lg:w-1/2">
      <section className="rounded-lg bg-red-600 p-8">
        <h2 className="text-center mb-2 text-2xl font-black text-white">
          Who{"'"}s that Pokemon?
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-evenly items-center gap-5 flex-col lg:flex-row md:flex-row">
            <div className="bg-gradient-to-b from-sky-400 to-sky-500 rounded-lg flex justify-between items-center">
              <Image
                src={pokemon.sprites.front_default}
                alt="Pokemon Image"
                title="Nice try"
                width={512}
                draggable={false}
                loading="eager"
                height={512}
                className={`filtered ${
                  guessed
                    ? "brightness-100 saturate-100"
                    : "brightness-0 saturate-0"
                } aspect-auto select-none`}
              />
            </div>
            <section className="bg-sky-500 p-4 rounded-lg flex flex-col items-center w-full lg:w-auto md:w-auto lg:h-full">
              <h2 className="font-black text-base lg:text-xl text-white flex gap-2 mb-2">
                Hints <span className="font-light text-white">(Types)</span>
              </h2>
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {pokemon.types.map(({ type }, i) => {
                  return (
                    <h4
                      key={i}
                      className={`${type.name} px-3 py-1 rounded-full`}
                    >
                      {type.name[0].toUpperCase() + type.name.slice(1)}
                    </h4>
                  );
                })}
              </div>
            </section>
          </div>
          <div className="flex items-center justify-center flex-col">
            {guessed && (
              <div
                className={`px-4 py-1 mt-5 lg:text-lg md:text-md text-sm w-full rounded-full z-50 text-center ${
                  endState === 1
                    ? "bg-green-500 text-white font-light"
                    : "bg-red-800 text-white font-light"
                }`}
              >
                {endState === 1
                  ? `Nice one! Pokemon was ${
                      pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
                    }`
                  : `Wrong! This is ${
                      pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
                    }`}
              </div>
            )}
            {!guessed && (
              <div className="flex w-full">
                <input
                  required
                  value={guess}
                  disabled={guessed}
                  onChange={(e) => setGuess(e.target.value)}
                  name="pokemon-name"
                  className="w-full mt-5 bg-sky-300 rounded-l-full text-lg outline-none focus:bg-sky-500 text-white font-bold duration-200 px-4"
                />
                <button
                  disabled={guessed}
                  className="w-1/3 mt-5 bg-green-500 rounded-r-full px-4 py-1 text-lg outline-none text-white font-bold duration-200"
                >
                  Guess
                </button>
              </div>
            )}
            {guessed && (
              <div className="mt-3">
                <button
                  onClick={restartGame}
                  className="bg-sky-500 text-white rounded-lg font-black px-3 py-1 hover:brightness-75 duration-200"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </form>
      </section>
    </article>
  ) : (
    <PlayBtn />
  );
};

export default Game;
