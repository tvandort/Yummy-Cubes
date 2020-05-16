import { SocketIOProvider, useSocket } from 'use-socketio';
import Messages from '@app/components/messages';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@app/hooks/useLocalStorage';
import Draggable from 'react-draggable';

enum Page {
  Name
}

const NamePicker = ({ onSelect }: { onSelect: (name: string) => void }) => {
  const [name, setName] = useState('');
  return (
    <div className="h-full w-full flex justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSelect(name);
        }}
      >
        <label className="flex flex-col space-y-4">
          <h1 className="text-center text-xl">What is your name?</h1>
          <input
            className="appearance-none border rounded w-full py-2 px-3 "
            type="text"
            value={name}
            onChange={({ target: { value } }) => {
              setName(value);
            }}
          />
          <button
            className="border rounded-lg bg-blue-500 text-white font-bold py-2"
            type="submit"
          >
            Join
          </button>
        </label>
      </form>
    </div>
  );
};

const Player = ({
  name,
  position,
  onPositionChange
}: {
  name: string;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}) => {
  return (
    <Draggable
      position={position}
      onDrag={(e, data) => {
        onPositionChange({ x: data.x, y: data.y });
      }}
    >
      <div>
        <div className="w-20 h-20 bg-gray-800 flex justify-center items-center text-lg text-white p-2">
          <div className="text-center">{name}</div>
        </div>
      </div>
    </Draggable>
  );
};

const Room = ({ name }: { name: string }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    []
  );
  const { socket: messagesSocket } = useSocket('message', (message) =>
    setMessages([...messages, message])
  );
  const [players, setPlayers] = useState<
    { name: string; position: { x: number; y: number } }[]
  >([]);
  const { socket: gameSocket } = useSocket('game', (gameState) => {
    setPlayers(gameState.players);
  });

  useEffect(() => {
    gameSocket.emit('add_player', name);
  }, [gameSocket, name]);

  return (
    <div className="h-full w-full flex justify-between">
      <div className="bg-blue-100 h-full flex-grow">
        {players.map(({ name, position }) => {
          return (
            <Player
              name={name}
              position={position}
              key={name}
              onPositionChange={(position) => {
                gameSocket.emit('move', {
                  name,
                  position
                });
              }}
            />
          );
        })}
      </div>
      <div className="bg-red-100 w-1/4 h-full flex flex-col justify-between border-l">
        <div className="px-4">
          {messages.map(({ name, message }, index) => {
            return (
              <div key={index}>
                <span className="font-bold">{name}:</span>
                &nbsp;
                <span>{message}</span>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            messagesSocket.emit('message', { name, message: newMessage });
            setNewMessage('');
          }}
          className="w-full flex justify-between border-t-2"
        >
          <input
            type="text"
            className="py-2 px-3 w-auto min-w-0 flex-grow"
            onChange={({ target: { value } }) => {
              setNewMessage(value);
            }}
            value={newMessage}
          />
          <button className="hidden sm:block bg-blue-500 text-white w-1/4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default function () {
  // return (
  //   <SocketIOProvider url="/">
  //     <Messages />
  //   </SocketIOProvider>
  // );

  const [name, setName] = useLocalStorage('name', '');

  return !Boolean(name) ? (
    <NamePicker onSelect={setName} />
  ) : (
    <SocketIOProvider url="/">
      <Room name={name} />
    </SocketIOProvider>
  );
}
