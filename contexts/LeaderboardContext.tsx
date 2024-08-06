// context/LeaderboardContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface LeaderboardContextProps {
  isOpen: boolean;
  openLeaderboard: () => void;
  closeLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextProps>({
  isOpen: false,
  openLeaderboard: () => {},
  closeLeaderboard: () => {},
});

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLeaderboard = () => {
    setIsOpen(true);
  };

  const closeLeaderboard = () => {
    setIsOpen(false);
  };

  return (
    <LeaderboardContext.Provider value={{ isOpen, openLeaderboard, closeLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => useContext(LeaderboardContext);
