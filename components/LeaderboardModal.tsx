import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from './MemoryGame';
import { useEffect, useState } from "react";

// Fetches a unique avatar URL from Lorem Picsum
const fetchAvatar = async (size: number, seed: string) => {
  return `https://picsum.photos/${size}?random=${seed}`;
};

interface LeaderboardModalProps {
  users: User[];
  closeLeaderboard: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ users, closeLeaderboard }) => {
  const [avatars, setAvatars] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        const newAvatars: { [key: string]: string } = {};
        for (const user of users) {
          const url = await fetchAvatar(100, user.id); // Use user ID as seed for uniqueness
          newAvatars[user.id] = url;
        }
        setAvatars(newAvatars);
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    loadAvatars();
  }, [users]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="relative w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <CardHeader className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-4">
            <TrophyIcon className="h-6 w-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-700">Leaderboard</h2>
          </div>
          <Button variant="ghost" onClick={closeLeaderboard}>
            <XIcon className="h-6 w-6 text-gray-700" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Attempts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={avatars[user.id] || '/fallback-image.png'}
                        alt="User Avatar"
                      />
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="flex items-center justify-center">
                    {user.attempts}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardModal;

// Icon components
function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function TrophyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
