import wretch, { WretcherOptions } from 'wretch';
import { Decoder } from 'io-ts/lib/Decoder';
import { validatorMiddleware } from './validatorMiddleware';

export type Request<RequestType, ResponseType> = (
  requestBody: RequestType
) => Promise<ResponseType>;

export const createPost = <RequestType, ResponseType>(
  decoder: Decoder<unknown, ResponseType>,
  url: string,
  opts?: WretcherOptions
): Request<RequestType, ResponseType> => {
  const doRequest = (body: RequestType) => {
    return wretch(url, opts)
      .middlewares([validatorMiddleware(decoder)])
      .post(body)
      .json<ResponseType>();
  };

  return doRequest;
};
