import { ConfiguredMiddleware, FetchLike } from 'wretch';
import { Decoder } from 'io-ts/lib/Decoder';

export const validatorMiddleware = <RT>(
  decoder: Decoder<RT>
): ConfiguredMiddleware => (next: FetchLike) => (url, opts) => {
  return next(url, opts).then(async (response) => {
    const clone = response.clone(); // Why do I have to do this?
    const json = await response.json();
    const decodingResult = decoder.decode(json);

    if (decodingResult._tag === 'Left') {
      throw new Error("Type couldn't decode.");
    }

    return clone;
  });
};
