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
        <RoomPrompt
          onJoin={() => {}}
          onCreate={() => {
            fetch('/api/rooms', { method: 'POST' });
          }}
        />
      )}
    </div>
  );
}
