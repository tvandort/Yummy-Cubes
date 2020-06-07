import NamePrompt from '@app/components/namePrompt';
import { useState } from 'react';
import RoomPrompt from '@app/components/roomPrompt';

const post = (name: string) => {
  const a: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // fetch<{}>('/api/rooms', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // });
};

export default function Index() {
  const [name, setName] = useState('');
  const [page, setPage] = useState<'name' | 'code'>('name');
  const data = { name };

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
      {page === 'code' && <RoomPrompt onJoin={() => {}} onCreate={() => {}} />}
    </div>
  );
}
