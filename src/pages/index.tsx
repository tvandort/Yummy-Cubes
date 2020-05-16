import { SocketIOProvider, useSocket } from 'use-socketio';
import Messages from '@app/components/messages';
import { useState } from 'react';
import { useLocalStorage } from '@app/hooks/useLocalStorage';

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

const Room = ({ name }: { name: string }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<{ user: string; message: string }[]>(
    []
  );
  const { socket } = useSocket('message', (message) =>
    setMessages([...messages, message])
  );
  return (
    <div className="h-full w-full flex justify-between">
      <div className="bg-blue-100 h-full flex-grow">
        This will be where the players start
      </div>
      <div className="bg-red-100 w-1/4 h-full flex flex-col justify-between border-l">
        <div className="px-4">
          {messages.map(({ user, message }, index) => {
            return (
              <div key={index}>
                <span className="font-bold">{user}:</span>
                &nbsp;
                <span>{message}</span>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            socket.emit('message', { user: name, message: newMessage });
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
