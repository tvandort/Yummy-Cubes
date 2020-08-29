import { useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/dist/client/router';
import {
  newRoomResponseDecoder,
  NewRoomRequest,
  NewRoomResponse
} from '@app/shared/validators/roomTypes';
import { createPost } from '@app/shared/requestGenerator';

interface RoomProps {}

const joinRoom = createPost<NewRoomRequest, NewRoomResponse>(
  newRoomResponseDecoder,
  '/api/rooms'
);

interface SuccessState {
  state: 'done';
  code: string;
  roomId: string;
}
interface ErroredState {
  state: 'errored';
  message: string;
}
interface LoadingState {
  state: 'loading';
}

type JoinState = SuccessState | ErroredState | LoadingState;

const Joined = ({ code, id }: { code: string; id: string }) => {
  return <div></div>;
};

// eslint-disable-next-line no-empty-pattern
export default function Room({}: RoomProps) {
  const { query } = useRouter();
  const id = query.id as string;
  const [joinState, setJoinState] = useState<JoinState>({ state: 'loading' });

  useEffect(() => {
    let canceled = false;

    const run = async () => {
      try {
        if (Boolean(id)) {
          const result = await joinRoom({ roomId: id });

          if (!canceled) {
            setJoinState({ state: 'done', ...result });
          }
        }
      } catch (ex) {
        if (!canceled) {
          setJoinState({ state: 'errored', message: (ex as Error).message });
        }
      }
    };

    run();

    return () => {
      canceled = true;
    };
  }, [id]);
  return (
    <>
      {joinState.state === 'loading' && <div>Joining...</div>}
      {joinState.state === 'errored' && <div>{joinState.message}</div>}
      {joinState.state === 'done' && (
        <Joined code={joinState.code} id={joinState.roomId} />
      )}
    </>
  );
}
