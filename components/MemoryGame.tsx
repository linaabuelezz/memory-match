// MemoryGame.tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import UserForm from './UserForm';
import { useLeaderboard, LeaderboardProvider } from '@/contexts/LeaderboardContext';
import LeaderboardModal from './LeaderboardModal';

export type User = {
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

function MemoryGame() {
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

  const { isOpen, openLeaderboard, closeLeaderboard } = useLeaderboard();

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

  const handleStart = (name: string, email: string) => {
    setName(name);
    setEmail(email);
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
    <LeaderboardProvider>
      <div className="relative min-h-screen">
        {!gameStarted ? (
          <div 
            className="bg-cover h-screen w-screen bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url(/bg1.webp)' 
            }}
          >
            <div className="text-center py-10">
              <UserForm onStart={handleStart}/>
            </div>
          </div>
        ) : (
          <>
            <div
              className="relative min-h-screen w-screen bg-cover bg-center bg-no-repeat md:pl-0 pl-0 pr-3 text-center"
              style={{ 
                backgroundImage: 'url(/bg1.webp)',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover'
              }}
            >
              <h2 className="font-bold pt-3 text-white text-3xl glow-animation">Memory Matcher</h2>
              <div className="text-white mt-3 flex justify-center space-x-4">
                <p>Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>
                <p>Attempts: {attempts}</p>
              </div>
              {gameOver && <h2 className="p-5 font-bold text-red-500 text-2xl">YOU WIN!</h2>}
              <div className="grid grid-cols-4 gap-5 mt-5 max-w-screen-sm mx-auto pl-7">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 sm:w-15 sm:h-15 md:w-28 md:h-28 max-w-sm:max-w-24 max-w-md:max-w-28 text-black font-bold text-xl sm:text-3xl transform border-2 border-white rounded-md bg-slate-200 flex justify-center items-center cursor-pointer transition-transform duration-300 ${flipped.includes(index) || solved.includes(index) ? "rotate-180" : ""}`}
                    onClick={() => handleClick(index)}
                  >
                    {flipped.includes(index) || solved.includes(index) ? (
                      <Image className="rotate-180 rounded-md" src={`/memory-cards/${card}.jpg`} fill sizes="(max-width: 200px) 100vw" alt={card} />
                    ) : (
                      "?"
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <button onClick={saveScore} className={`font-semibold flex p-3 rounded-md mt-5 mx-auto ${gameOver ? 'bg-gradient-to-r from-indigo-500 to-pink-300' : 'bg-gradient-to-r from-teal-500 to-cyan-500 cursor-not-allowed'}`}>Save Score</button>
              </div>
              {errorMessage && (
                <div className="mt-5 text-red-500 text-lg">{errorMessage}</div>
              )}
              <button onClick={openLeaderboard} className="px-4 py-2 mt-5 mb-5 bg-green-500 text-white rounded-md hover:bg-green-600">View Leaderboard</button>
            </div>
            {isOpen && <LeaderboardModal users={users} closeLeaderboard={closeLeaderboard} />}
          </>
        )}
      </div>
    </LeaderboardProvider>
  );
}

export default MemoryGame;
