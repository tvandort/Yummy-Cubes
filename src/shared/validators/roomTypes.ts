import * as t from 'io-ts/lib/Decoder';

export const newRoomRequestDecoder = t.type({
  roomId: t.string
});
export type NewRoomRequest = t.TypeOf<typeof newRoomRequestDecoder>;

export const newRoomResponseDecoder = t.type({
  roomId: t.string,
  code: t.string,
  nickname: t.string,
  promptName: t.boolean
});
export type NewRoomResponse = t.TypeOf<typeof newRoomResponseDecoder>;
