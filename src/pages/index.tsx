import { SocketIOProvider } from 'use-socketio';
import Messages from '@app/components/messages';
import { useState } from 'react';

export default function () {
  // return (
  //   <SocketIOProvider url="/">
  //     <Messages />
  //   </SocketIOProvider>
  // );
  const [name, setName] = useState('');

  return (
    <div className="h-full w-full flex justify-center items-center">
      <form
        onChange={(e) => {
          e.preventDefault();
        }}
      >
        <label className="flex flex-col space-y-2">
          <div className="text-center">What is your name?</div>
          <input
            className="border"
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
}
