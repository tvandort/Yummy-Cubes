import { RequestHandler } from 'express';
import { Decoder, draw } from 'io-ts/lib/Decoder';

import { ParamsDictionary } from 'express-serve-static-core';
import { Tree } from 'fp-ts/lib/Tree';
import { FreeSemigroup } from 'io-ts/lib/FreeSemigroup';
import { DecodeError } from 'io-ts/lib/DecodeError';
import { isLeft } from 'fp-ts/lib/Either';

const ERROR_TAG = 'Left';

export const validator: <RequestType, ResponseType>(
  decoder: Decoder<unknown, RequestType>
) => RequestHandler<ParamsDictionary, ResponseType, RequestType> = (
  decoder
) => (req, res, next) => {
  const result = decoder.decode(req.body);

  if (isLeft(result)) {
    const details = draw(result.left);

    const error: RestError = {
      code: 'BadArgument',
      message: 'Invalid request body',
      details
    };

    res.status(400).send({ status: 'error', error } as any);
  } else {
    next();
  }
};

export const cookieValidator: <Cookie>(
  decoder: Decoder<unknown, Cookie>
) => RequestHandler<ParamsDictionary, Request, Response> = (decoder) => (
  req,
  res,
  next
) => {
  const result = decoder.decode(req.cookies);

  if (isLeft(result)) {
    const details = draw(result.left);

    const error: RestError = {
      code: 'BadArgument',
      message: 'Missing player cookie',
      details
    };

    res.status(400).send({ status: 'error', error } as any);
  } else {
    next();
  }
};

export interface RestError {
  code: 'BadArgument';
  message: string;
  details: string;
}
