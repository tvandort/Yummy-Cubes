import * as t from 'io-ts/lib/Decoder';

export const userIdentifierCookieDecoder = t.type({
  'user-identity': t.string
});

export type UserIdentifierCookie = t.TypeOf<typeof userIdentifierCookieDecoder>;
