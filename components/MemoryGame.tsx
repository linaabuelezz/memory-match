"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

type User = {
  id: string;
  name: string;
  email: string;
  attempts: number;
};

const generateDeck = () => {
  const memoryCards = [
    "alien",
    "astronaut",
    "dolphin",
    "grandma",
    "laptopboy",
    "penguin",
    "pizza",
    "tiger"
  ];

  const deck = [...memoryCards, ...memoryCards];
  return deck.sort(() => Math.random() - 0.5);
};

async function addUser(name: string, email: string, attempts: number) {
  try {
    const response = await fetch('/api/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, attempts }),
    });

    if (!response.ok) {
      throw new Error('Failed to add or update user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users');
      const data: User[] = await res.json();
      data.sort((a, b) => a.attempts - b.attempts);
      setUsers(data);
      console.log(data);
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    const checkForMatch = () => {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setSolved([...solved, ...flipped]);
      }
      setFlipped([]);
    };
    if (flipped.length === 2) {
      setTimeout(() => {
        checkForMatch();
        setAttempts(attempts + 1);
      }, 1000);
    }
  }, [cards, flipped, solved]);

  const handleClick = (index: number) => {
    if (!flipped.includes(index) && flipped.length < 2) {
      if (!gameStarted) {
        setGameStarted(true);
      }
      setFlipped([...flipped, index]);
    }
  };

  const gameOver = cards.length === solved.length;

  const handleStart = () => {
    setGameStarted(true);
  }

  async function saveScore() {
    if (!gameOver) {
      setErrorMessage('You need to finish the game to save your score!');
      return;
    }
    try {
      console.log(name, email, attempts);
      const updatedUser = await addUser(name, email, attempts);
      console.log('User added or updated:', updatedUser);
      setErrorMessage(''); 
    } catch (error) {
      console.error('Error adding or updating user:', error);
    }
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
    setAttempts(0);
    setSeconds(0);
    setGameStarted(false);
    location.reload();
  }
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="text-center">
      {!gameStarted ? (
        <form className="mt-5" onSubmit={(e) => { e.preventDefault(); handleStart(); }}>
          <h2 className="font-bold text-white text-3xl">Enter Your Details</h2>
          <div className="mt-5">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-md"
              required
            />
          </div>
          <div className="mt-3">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-md"
              required
            />
          </div>
          <button type="submit" className="flex p-5 bg-slate-500 rounded-md mt-5 ml-16">Start Game</button>
        </form>
      ) : (
        <>
          <h2 className="font-bold text-white text-3xl">Memory Matcher</h2>
          <div className="text-white mt-3">
            <p>Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>
            <p>Attempts: {attempts}</p>
          </div>
          {gameOver && <h2 className="p-5 font-bold text-red-500 text-2xl">YOU WIN!</h2>}
          <div className="grid grid-cols-4 gap-5 mt-5">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative w-28 h-28 text-black font-bold text-3xl transform bg-slate-200 flex justify-center items-center cursor-pointer transition-transform duration-300 ${flipped.includes(index) || solved.includes(index) ? "rotate-180" : ""}`}
                onClick={() => handleClick(index)}
              >
                {flipped.includes(index) || solved.includes(index) ? (
                  <Image className="rotate-180" src={`/memory-cards/${card}.jpg`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt={`${card}`} />
                ) : (
                  "?"
                )}
              </div>
            ))}
          </div>
          <button
            className={`flex p-5 rounded-md mt-5 ${gameOver ? 'bg-slate-500' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={saveScore}
            disabled={!gameOver}
          >
            Save Score
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <div className="mt-5">
            <h3 className="font-bold text-black text-2xl">Leaderboard</h3>
            <ul>
              {users.map((user, index) => (
                <li key={user.id}>{index + 1}. {user.name} - {user.attempts}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
