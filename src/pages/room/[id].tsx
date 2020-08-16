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
  roomCode: string;
}
interface ErroredState {
  state: 'errored';
  message: string;
}
interface LoadingState {
  state: 'loading';
}

type JoinState = SuccessState | ErroredState | LoadingState;

// eslint-disable-next-line no-empty-pattern
export default function Room({}: RoomProps) {
  const { query } = useRouter();
  const id = query.id as string;
  const [joinState, setJoinState] = useState<JoinState>({ state: 'loading' });

  useEffect(() => {
    let canceled = false;

    const run = async () => {
      try {
        const result = await joinRoom({ roomId: id });

        if (!canceled) {
          setJoinState({ state: 'done', roomCode: result.code });
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
      {joinState.state === 'done' && <div>You joined!</div>}
    </>
  );
}
