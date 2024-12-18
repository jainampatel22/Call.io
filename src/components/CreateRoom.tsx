import  { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocketContext } from "@/context/SocketProviders";
import { Boxes } from "@/components/ui/background-boxes";
import { Header } from "@/components/Header";

export function CreateRoomPage() {
  const [username, setUsername] = useState("");
  const { socket } = useContext(SocketContext) || {};
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!socket) {
      alert("Socket connection not established");
      return;
    }

    // Emit create room event
    socket.emit("create-room");

    // Listen for room creation
    const handleRoomCreated = ({ roomId }: { roomId: string }) => {
      // Navigate to the newly created room
      navigate(`/room/${roomId}`);
      
      // Remove the listener to prevent memory leaks
      socket.off("room-created", handleRoomCreated);
    };

    socket.on("room-created", handleRoomCreated);

    // Optional: Handle any potential errors
    socket.on("room-error", (error: { message: any; }) => {
      console.error("Room creation error:", error);
      alert(error.message || "Failed to create room");
    });
  };

  return (
    <>
      <div className="z-10 bg-black text-white">
        <Header />
      </div>

      <div className="bg-black text-white flex justify-center items-center min-h-screen w-full">
        <Boxes />
        <Card className="w-[350px] z-10 bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Create New Room</CardTitle>
            <CardDescription className="text-white/70">
              Instantly start a video call with friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Enter your name" 
                  className="rounded-xl bg-black/50 border-white/20 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleCreateRoom} 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}