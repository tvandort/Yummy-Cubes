import * as t from 'io-ts/lib/Decoder';

export interface Emittable<Key extends string> {
  key: Key;
}

export interface CallbackEvent<Key extends string> {
  key: Key;
}

const InitializeMessagesDecoder = t.literal('initialize-messages');
const AddMessageDecoder = t.literal('add-message');
const CallbackKeysDecoder = t.union(
  InitializeMessagesDecoder,
  AddMessageDecoder
);

export type CallbackKeyInitializeMessages = t.TypeOf<
  typeof InitializeMessagesDecoder
>;
export type CallbackKeyAddMessage = t.TypeOf<typeof AddMessageDecoder>;
export type CallbackKeys = t.TypeOf<typeof CallbackKeysDecoder>;

const InitializeMessagesEventDecoder = t.type({
  key: InitializeMessagesDecoder,
  messages: t.array(t.string)
});

const AddMessageEventDecoder = t.type({
  key: AddMessageDecoder,
  message: t.string,
  user: t.string
});

export const CallbackEventsDecoders = t.union(
  InitializeMessagesEventDecoder,
  AddMessageEventDecoder
);

type types = t.TypeOf<typeof CallbackEventsDecoders>;

export type InitializeMessagesEvent = t.TypeOf<
  typeof InitializeMessagesEventDecoder
>;
export type AddMessageEvent = t.TypeOf<typeof AddMessageEventDecoder>;

export const EmitKeyJoinDecoder = t.literal('join');
export type EmitKeyJoin = t.TypeOf<typeof EmitKeyJoinDecoder>;
export const EmitJoinDecoder = t.type({
  key: EmitKeyJoinDecoder,
  message: t.string,
  user: t.string
});

interface JoinEvent extends Emittable<EmitKeyJoin> {
  code: string;
  id: string;
  nickname: string;
}

export type EmitKeySay = 'say';
export interface SayEvent extends Emittable<EmitKeySay> {
  words: string;
}

export type EmitKeys = EmitKeyJoin | EmitKeySay;

export type EmitEvents = JoinEvent | SayEvent;

export const EmitDecoders = EmitJoinDecoder;

// interface InitializeMessagesEvent
//   extends CallbackEvent<CallbackKeyInitializeMessages> {
//   messages: string[];
// }

// interface AddMessageEvent extends CallbackEvent<CallbackKeyAddMessage> {
//   message: string;
//   user: string;
// }

export type CallbackEvents = types;
