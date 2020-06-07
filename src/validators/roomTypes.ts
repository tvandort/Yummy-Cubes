import * as t from 'io-ts/lib/Decoder';

export const newRoomRequestDecoder = t.type({
  name: t.string
});
export type NewRoomRequest = t.TypeOf<typeof newRoomRequestDecoder>;

export const newRoomResponseDecoder = t.type({
  roomId: t.string
});
export type NewRoomResponse = t.TypeOf<typeof newRoomResponseDecoder>;
