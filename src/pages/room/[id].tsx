import { useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/dist/client/router';
import {
  newRoomResponseDecoder,
  NewRoomRequest,
  NewRoomResponse
} from '@app/shared/validators/roomTypes';
import { createPost } from '@app/shared/requestGenerator';
import { SocketIOProvider, useSocket } from 'use-socketio';

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

interface Emittable<Key extends string> {
  key: Key;
}

interface CallbackEvent<Key extends string> {
  key: Key;
}

type CallbackKeyInitializeMessages = 'initialize-messages';
type CallbackKeyAddMessage = 'add-message';
type CallbackKeys = CallbackKeyInitializeMessages;
interface InitializeMessagesEvent
  extends CallbackEvent<CallbackKeyInitializeMessages> {
  messages: string[];
}

interface AddMessageEvent extends CallbackEvent<CallbackKeyAddMessage> {
  message: string;
  user: string;
}

type CallbackEvents = InitializeMessagesEvent | AddMessageEvent;

function useTypedSocket<
  CallbackEvents,
  EmitKeys extends string,
  EmitEvents extends Emittable<EmitKeys>
>(eventKey: string, callback: (message: CallbackEvents) => void) {
  const validateResponseCallback = (message: unknown) => {
    // decode
    // throw if bad
    // call method if good.
    //callback(message);
  };
  const { socket } = useSocket(eventKey, validateResponseCallback);

  return {
    socket: {
      emit: function (emit: EmitEvents) {
        socket.emit(emit.key, emit);
      }
    }
  };
}

type JoinState = SuccessState | ErroredState | LoadingState;

type EmitKeyJoin = 'join';
interface JoinEvent extends Emittable<EmitKeyJoin> {
  code: string;
  id: string;
}

type EmitKeySay = 'say';
interface SayEvent extends Emittable<EmitKeySay> {
  words: string;
}

type EmitKeys = EmitKeyJoin | EmitKeySay;

type EmitEvents = JoinEvent | SayEvent;

const Something = ({ code, id }: { code: string; id: string }) => {
  const { socket: roomSocket } = useTypedSocket<
    CallbackEvents,
    EmitKeys,
    EmitEvents
  >('room', (roomState) => {
    if (roomState.key === 'add-message') {
    }
  });

  useEffect(() => {
    roomSocket.emit({ key: 'join', code, id });
  });

  return <div></div>;
};

const Joined = ({ code, id }: { code: string; id: string }) => {
  return (
    <SocketIOProvider url="/">
      <Something code={code} id={id} />
    </SocketIOProvider>
  );
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
