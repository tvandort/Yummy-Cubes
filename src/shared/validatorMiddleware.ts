import { ConfiguredMiddleware, FetchLike } from 'wretch';
import { Decoder, draw } from 'io-ts/lib/Decoder';
import { isLeft } from 'fp-ts/lib/Either';

export const validatorMiddleware = <RT>(
  decoder: Decoder<unknown, RT>
): ConfiguredMiddleware => (next: FetchLike) => async (url, opts) => {
  const response = await next(url, opts);
  const clone = response.clone(); // Why do I have to do this?

  if (![200, 201].includes(response.status)) {
    return clone;
  }

  const json = await response.json();
  const decodingResult = decoder.decode(json);

  if (isLeft(decodingResult)) {
    throw new Error(draw(decodingResult.left));
  }

  return clone;
};
