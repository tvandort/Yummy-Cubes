import React, { useState, useEffect } from 'react';

const placeholderNames = [
  'John',
  'Jade',
  'Rose',
  'Dave',
  'Jake',
  'Roxy',
  'Dirk',
  'Jane'
];

const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));

const randomName = () => placeholderNames[randomInt(placeholderNames.length)];

export default function NamePrompt({ onGo }: { onGo: (name: string) => void }) {
  const [name, setName] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    // Needed because otherwise the SRR renders two different values.
    // NextJS isn't a fan of that.
    setPlaceholder(randomName());
  }, []);

  return (
    <form
      className="flex flex-col text-center items-center space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onGo(name);
      }}
    >
      <label className="font-bold text-xl" htmlFor="nameInput">
        What's your name?
      </label>
      <div className="flex">
        <input
          id="nameInput"
          type="text"
          className="border px-3 py-2"
          placeholder={`e.g. ${placeholder}`}
          onChange={({ target: { value } }) => {
            setName(value);
          }}
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
