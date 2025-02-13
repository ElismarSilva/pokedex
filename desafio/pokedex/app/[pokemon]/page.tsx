'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';

const fetchPokemonDetails = async (id: string) => {
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return data;
};


export default function PokemonDetails() {
  const router = useRouter();
  const [pokemonUnique, setPokemonUnique] = useState<any>([])
  const { id } = router.query;
  const fetchUnique = async () => {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/berry/${1}`);
    setPokemonUnique(pokemonUnique)
    return data.results;
  };




  useEffect(()=> {
      fetchUnique();
  }, []) 

  useEffect(()=> {

    console.log('pokemonUnique aquiiiiiii', pokemonUnique)

  }, [pokemonUnique])

  const { data: pokemon, error, isLoading } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemonDetails(id as string),
    enabled: !!id,
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar os detalhes do Pokémon.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center capitalize">{pokemon.name}</h1>

      <div className="flex flex-col items-center mt-6">
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={150}
          height={150}
        />

        <div className="mt-4">
          <p><strong>Altura:</strong> {pokemon.height / 10} m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>

          <p><strong>Tipo(s):</strong> {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
        </div>

        <Link href="/">
          <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
            Voltar para a Lista
          </button>
        </Link>
      </div>
    </div>
  );
}
