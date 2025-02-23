"use client";

import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Player {
  id: string;
  username: string;
  score: number;
  madePick: boolean;
}

interface Pick {
  id: string;
  category: string;
  timeLimit: number;
  questionCount: number;
}

interface Room {
  players: Player[];
  picks: Pick[];
  gameStarted: boolean;
  host: string | null;
}

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

export default function RoomPage({ params }: { params: Promise<{ roomCode: string }> }) {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null); // State for socket.id
  const [room, setRoom] = useState<Room | null>(null);
  const [category, setCategory] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionCount, setQuestionCount] = useState(5);
  const [message, setMessage] = useState("");

  // Fetch and set roomCode from params
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setRoomCode(resolvedParams.roomCode);
    };
    fetchParams();
  }, [params]);

  // Handle WebSocket events
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket);
      setSocketId(socket?.id || "loading..."); // Set socket.id when connected
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
    });

    socket.on("roomUpdate", (updatedRoom: Room) => {
      console.log("Room updated:", updatedRoom);
      setRoom(updatedRoom);
    });

    socket.on("AllPlayersPicked", (picks: Pick[]) => {
      console.log("All players picked:", picks);
      setRoom((prevRoom) => prevRoom && { ...prevRoom, picks });
    });

    socket.on("gameStarted", () => {
      setMessage("Game has started!");
    });

    // Cleanup listeners
    return () => {
      socket.off("connect");
      socket.off("roomUpdate");
      socket.off("AllPlayersPicked");
      socket.off("gameStarted");
    };
  }, []);

  // Emit joinRoom after roomCode and socketId are available
  useEffect(() => {
    if (roomCode && socketId) {
      socket.emit("joinRoom", {
        username: `User-${socketId.substring(0, 5)}`, // Generate username based on socket.id
        roomCode,
      });
    }
  }, [roomCode, socketId]);

  const handlePickSubmit = () => {
    if (!category) {
      setMessage("Please select a category.");
      return;
    }

    socket.emit("makePick", {
      roomCode,
      category,
      timeLimit,
      questionCount,
    });

    setMessage("Pick submitted! Waiting for others...");
  };

  const handleStartGame = () => {
    if (!room?.host) {
      setMessage("Only the host can start the game.");
      return;
    }

    socket.emit("startGame", {
      roomCode,
      settings: room.picks[0], // Example: use the first pick in the pool
    });
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl mb-5 text-center">
        Room: {roomCode || "Loading..."}
      </h1>
      {room ? (
        <>
          <div className="mb-5">
            <h2 className="text-2xl">Players in the Room:</h2>
            <ul className="list-disc list-inside">
              {room.players.map((player) => (
                <li key={player.id}>
                  {player.username}{" "}
                  {player.madePick ? "(Pick submitted)" : "(Waiting)"}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-5">
            <h2 className="text-2xl">Make Your Pick</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded mb-2"
            >
              <option value="">Select Category</option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="History">History</option>
            </select>
            <div>
              <label className="block mb-1">Time Limit (seconds):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Number of Questions:</label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={handlePickSubmit}
              className="p-3 bg-blue-500 text-white mt-3"
            >
              Submit Pick
            </button>
          </div>
          {room.picks.length > 0 && (
            <div className="mb-5">
              <h2 className="text-2xl">Picks Made by Players:</h2>
              <ul className="list-disc list-inside">
                {room.picks.map((pick, index) => (
                  <li key={index}>
                    Category: {pick.category}, Time Limit: {pick.timeLimit}s,
                    Questions: {pick.questionCount}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {room.host && (
            <button
              onClick={handleStartGame}
              className="p-3 bg-green-500 text-white"
            >
              Start Game
            </button>
          )}
        </>
      ) : (
        <p>Loading room data...</p>
      )}
      {message && <p className="text-red-500 mt-5">{message}</p>}
    </div>
  );
}
