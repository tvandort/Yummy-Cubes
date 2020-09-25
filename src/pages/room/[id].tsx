import { useEffect, useState, useReducer } from 'react';
import { useRouter } from 'next/dist/client/router';
import {
  newRoomResponseDecoder,
  NewRoomRequest,
  NewRoomResponse
} from '@app/shared/validators/roomTypes';
import { createPost } from '@app/shared/requestGenerator';
import { SocketIOProvider, useSocket } from 'use-socketio';
import { Decoder } from 'io-ts/lib/Decoder';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts/lib/Decoder';

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

const InitializeMessagesDecoder = t.literal('initialize-messages');
const AddMessageDecoder = t.literal('add-message');
const CallbackKeysDecoder = t.union(
  InitializeMessagesDecoder,
  AddMessageDecoder
);

type CallbackKeyInitializeMessages = t.TypeOf<typeof InitializeMessagesDecoder>;
type CallbackKeyAddMessage = t.TypeOf<typeof AddMessageDecoder>;
type CallbackKeys = t.TypeOf<typeof CallbackKeysDecoder>;

const InitializeMessagesEventDecoder = t.type({
  key: InitializeMessagesDecoder,
  messages: t.array(t.string)
});

const AddMessageEventDecoder = t.type({
  key: AddMessageDecoder,
  message: t.string,
  user: t.string
});

const Meta = t.union(InitializeMessagesEventDecoder, AddMessageEventDecoder);

type types = t.TypeOf<typeof Meta>;

type InitializeMessagesEvent = t.TypeOf<typeof InitializeMessagesEventDecoder>;
type AddMessageEvent = t.TypeOf<typeof AddMessageEventDecoder>;

type CallbackEvents = types;

function useSocketWithDecoder<
  CallbackEvents,
  EmitKeys extends string,
  EmitEvents extends Emittable<EmitKeys>
>(
  eventKey: string,
  decoder: Decoder<unknown, CallbackEvents>,
  callback: (message: CallbackEvents) => void
) {
  const validator = (message: unknown) => {
    const result = decoder.decode(message);

    if (isLeft(result)) {
      throw new Error('Could not decode socket.io message.');
    } else {
      callback(result.right);
    }
  };

  return useTypedSocket<CallbackEvents, EmitKeys, EmitEvents>(
    eventKey,
    validator
  );
}

function useTypedSocket<
  CallbackEvents,
  EmitKeys extends string,
  EmitEvents extends Emittable<EmitKeys>
>(eventKey: string, callback: (message: CallbackEvents) => void) {
  const { socket } = useSocket(eventKey, callback);

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

const Room = ({ code, id }: { code: string; id: string }) => {
  const { socket: roomSocket } = useSocketWithDecoder<
    CallbackEvents,
    EmitKeys,
    EmitEvents
  >('room', Meta, (roomState) => {
    if (roomState.key === 'add-message') {
    }
  });

  useEffect(() => {
    roomSocket.emit({ key: 'join', code, id });
  });

  return <div>hello!</div>;
};

const Joined = ({ code, id }: { code: string; id: string }) => {
  return (
    <SocketIOProvider url="/">
      <Room code={code} id={id} />
    </SocketIOProvider>
  );
};

// eslint-disable-next-line no-empty-pattern
export default function JoinedRoom({}: RoomProps) {
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
