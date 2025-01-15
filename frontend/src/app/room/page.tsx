"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

export default function CreateRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const createRoom = () => {
    if (!username) {
      setMessage("Username is required.");
      return;
    }

    // Generate a random 6-character room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);

    // Emit the create room event to the backend
    socket.emit("joinRoom", { username, roomCode: code });

    // Redirect to the room page
    router.push(`/room/${code}`);
  };

  const joinRoom = () => {
    if (!username || !roomCode) {
      setMessage("Both username and room code are required.");
      return;
    }

    // Emit the join room event to the backend
    socket.emit("joinRoom", { username, roomCode });

    // Redirect to the room page
    router.push(`/room/${roomCode}`);
  };

  return (
    <div className="p-10">
      <h1 className="text-5xl mb-5 text-center">Create or Join a Room</h1>
      <div className="grid gap-5">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="p-5 border bg-secondary-color text-3xl"
        />
        <div>
          <button onClick={createRoom} className="p-5 bg-tertiary-color text-white text-3xl">
            Create Room
          </button>
        </div>
        <input
          type="text"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          placeholder="Enter room code"
          className="p-5 border bg-secondary-color text-3xl"
        />
        <div>
          <button onClick={joinRoom} className="p-5 bg-tertiary-color text-white text-3xl">
            Join Room
          </button>
        </div>
        {message && <p className="text-xl text-red-500">{message}</p>}
      </div>
    </div>
  );
}
