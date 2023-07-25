"use client";

import { useEffect, useState } from "react";

interface Character {
  id: string;
  name: string;
  imageURL: string | null;
  rarity: string;
  createdAt: string; // Adjust this type based on the actual type from the server
}

const SummoningComponent = ({ characters }: { characters: Character[] }) => {
  const [result, setResult] = useState<Character[] | null>(null);

  // Extract characters from the props
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);

  // Character rate groups (initially empty)
  const [charactersWith70Rate, setCharactersWith70Rate] = useState<Character[]>(
    []
  );
  const [charactersWith29Rate, setCharactersWith29Rate] = useState<Character[]>(
    []
  );
  const [charactersWith1Rate, setCharactersWith1Rate] = useState<Character[]>(
    []
  );

  const getChars = async () => {
    try {
      const response = await fetch("/api/summon/");
      const data = await response.json(); // Parse the response body as JSON

      setAllCharacters(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChars();
  }, []);

  useEffect(() => {
    // Separate characters into rate groups based on their rarity
    const rareCharacters = allCharacters.filter(
      (character) => character.rarity === "Rare"
    );
    const epicCharacters = allCharacters.filter(
      (character) => character.rarity === "Epic"
    );
    const legendaryCharacters = allCharacters.filter(
      (character) => character.rarity === "Legendary"
    );

    setCharactersWith70Rate(rareCharacters);
    setCharactersWith29Rate(epicCharacters);
    setCharactersWith1Rate(legendaryCharacters);
  }, [allCharacters]);

  const getCharacterFromGroup = (characterGroup: Character[]): Character => {
    // Generate a random index based on the length of the character group
    const randomIndex = Math.floor(Math.random() * characterGroup.length);

    // Get the character at the random index
    return characterGroup[randomIndex];
  };

  const summonCharacters = () => {
    const numSummoned = 10; // Number of characters to summon at once
    const summonedCharacters: Character[] = [];

    for (let i = 0; i < numSummoned; i++) {
      // Generate a random number between 0 and 1
      const randomNumber = Math.random();

      // Determine the summoned character based on the rates
      let summonedCharacter: Character | null = null;

      if (randomNumber <= 0.7) {
        // Characters with 70% rate
        summonedCharacter = getCharacterFromGroup(charactersWith70Rate);
      } else if (randomNumber <= 0.99) {
        // Characters with 29% rate
        summonedCharacter = getCharacterFromGroup(charactersWith29Rate);
      } else {
        // Characters with 1% rate
        summonedCharacter = getCharacterFromGroup(charactersWith1Rate);
      }

      if (summonedCharacter) {
        summonedCharacters.push(summonedCharacter);
      }
    }

    setResult(summonedCharacters);
  };

  return (
    <div>
      <button onClick={summonCharacters}>Summon</button>
      {result && (
        <ul>
          {result.map((character, index) => (
            <li
              key={index}
              className={`character-item item-${index + 1}`}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              {character.name} - Rarity: {character.rarity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SummoningComponent;
