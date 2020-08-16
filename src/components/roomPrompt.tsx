import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function RoomPrompt({
  initialRoomId
}: {
  initialRoomId: string;
}) {
  const [code, setCode] = useState(initialRoomId);

  return (
    <div className="flex flex-col items-center space-y-20">
      <div className="flex flex-col text-center items-center space-y-4">
        <label className="font-bold text-xl" htmlFor="roomCodeInput">
          If you have a room code enter it below:
        </label>
        <div className="flex">
          <input
            type="text"
            id="roomCodeInput"
            className="border w-64 px-3 py-2"
            onChange={({ target: { value } }) => {
              setCode(value);
            }}
            placeholder="e.g. horse-battery-staple"
            value={code}
          />
          <Link href={`room/${code}`}>
            <a
              type="submit"
              className="border-t border-r border-b border-blue-600 bg-blue-600 text-white px-3 py-2 flex-no-wrap font-bold"
            >
              Go!
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
