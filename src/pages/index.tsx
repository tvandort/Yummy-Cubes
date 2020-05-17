import NamePrompt from '@app/components/namePrompt';
import { useState } from 'react';
import RoomPrompt from '@app/components/roomPrompt';

export default function Index() {
  const [name, setName] = useState('');
  const [page, setPage] = useState<'name' | 'code'>('name');

  return (
    <div className="flex justify-center items-center h-full">
      {page === 'name' && (
        <NamePrompt
          onGo={(name) => {
            setName(name);
            setPage('code');
          }}
        />
      )}
      {page === 'code' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <RoomPrompt onGo={() => {}} name={name} />
          <label htmlFor="createNewRoom" className="text-lg font-bold">
            or create a new room:
          </label>
          <button
            id="createNewRoom"
            className="font-bold text-white bg-blue-600 px-3 py-2"
          >
            Create New Room
          </button>
        </div>
      )}
    </div>
  );
}
