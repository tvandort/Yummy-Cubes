import { useState } from 'react';
import randomWords from 'random-words';

export default function RoomPrompt({
  onJoin,
  onCreate,
  name
}: {
  onJoin: (code: string) => void;
  onCreate: () => void;
  name: string;
}) {
  const [code, setCode] = useState('');

  const placeholder = randomWords(3).join('-');

  return (
    <div className="flex flex-col items-center space-y-4">
      <form
        className="flex flex-col text-center items-center space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onJoin(code);
        }}
      >
        <label
          className="font-bold text-xl flex flex-col space-y-2"
          htmlFor="roomCodeInput"
        >
          <span>Hi, {name}!</span>
          <span>If you have a room code enter it below:</span>
        </label>
        <div className="flex">
          <input
            type="text"
            id="roomCodeInput"
            className="border px-3 py-2"
            onChange={({ target: { value } }) => {
              setCode(value);
            }}
            placeholder={`e.g. ${placeholder}`}
          />
          <button
            type="submit"
            className="border-t border-r border-b border-blue-600 bg-blue-600 text-white px-3 py-2 flex-no-wrap font-bold"
          >
            Go!
          </button>
        </div>
      </form>
      <form
        className="flex flex-col text-center items-center space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onCreate();
        }}
      >
        <label htmlFor="createNewRoom" className="text-lg font-bold">
          or create a new room:
        </label>
        <button
          id="createNewRoom"
          className="font-bold text-white bg-blue-600 px-3 py-2"
          onClick={onCreate}
          type="submit"
        >
          Create New Room
        </button>
      </form>
    </div>
  );
}
