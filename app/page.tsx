"use client";
import MemoryGame from "@/components/MemoryGame";
import { LeaderboardProvider } from "@/contexts/LeaderboardContext";

export default function Home() {
  return (
    <LeaderboardProvider>
    <main className="flex min-h-screen flex-col items-center justify-between">
      <MemoryGame />
    </main>
    </LeaderboardProvider>
  );
}
