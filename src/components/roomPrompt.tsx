import { useState } from 'react';
import randomWords from 'random-words';

export default function RoomPrompt({
  onGo,
  name
}: {
  onGo: (code: string) => void;
  name: string;
}) {
  const [code, setCode] = useState('');

  const placeholder = randomWords(3).join('-');

  return (
    <form
      className="flex flex-col text-center items-center space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onGo(code);
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
          className="border-t border-r border-b border-blue-600 bg-blue-600 text-white px-3 py-2 flex-no-wrap"
        >
          Go!
        </button>
      </div>
    </form>
  );
}
