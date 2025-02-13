'use client';

import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

const fetchPokemons = async () => {
  const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
  return data.results;
};

const PokemonList = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ['pokemons'], queryFn: fetchPokemons });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(151 / itemsPerPage);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os Pokémon.</div>;

  // Filtra os Pokémon pelo nome
  const filteredPokemons = data.filter((pokemon: { name: string }) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginação: exibe apenas 20 por página
  const paginatedPokemons = filteredPokemons.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div>
      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Digite o nome do Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      />
      {/* Se nenhum Pokémon for encontrado */}
      {filteredPokemons.length === 0 ? (
          <p className="text-center text-black-500 font-semibold">
            Nenhum Pokémon encontrado com o nome "{search}". Tente novamente. 
          </p>
      ) : null}


      {/* Lista de Pokémon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paginatedPokemons.map((pokemon: { name: string; url: string }, index: number) => {
          const pokemonId = data.findIndex((p: { name: string }) => p.name === pokemon.name) + 1;
          return (
            <Link key={pokemon.name} href={`/pokemon/${pokemonId}`}>
              <div className="p-4 border rounded-lg text-center cursor-pointer hover:shadow-lg">
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <p className="capitalize">{pokemon.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Controles de Paginação */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className={`px-4 py-2 border rounded-lg ${
            page === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
          }`}
        >
          Anterior
        </button>

        <span>Página {page + 1} de {totalPages}</span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className={`px-4 py-2 border rounded-lg ${
            page >= totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Lista de Pokémon</h1>

        <PokemonList />

        <footer className="text-center mt-8 text-gray-500">
          <p>&copy; Level33 - 2025</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
