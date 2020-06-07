import { RequestHandler } from 'express';
import { Decoder } from 'io-ts/lib/Decoder';
import { ParamsDictionary } from 'express-serve-static-core';
import { Tree } from 'fp-ts/lib/Tree';

const ERROR_TAG = 'Left';

export const validator: <RequestType, ResponseType>(
  decoder: Decoder<RequestType>
) => RequestHandler<ParamsDictionary, ResponseType, RequestType> = (
  decoder
) => (req, res, next) => {
  const result = decoder.decode(req.body);

  if (result._tag === ERROR_TAG) {
    const details: Array<RestError> = getErrorValues(
      result.left
    ).map((message) => ({ code: 'BadArgument', message, details: [] }));

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

export interface RestError {
  code: 'BadArgument';
  message: string;
  details: Array<RestError>;
}

const getErrorValues = (forest: Array<Tree<string>>): Array<string> => {
  const errors: string[] = [];
  for (let error of forest) {
    errors.push(error.value);
    if (error.forest.length > 0) {
      errors.push(...getErrorValues(error.forest));
    }
  }

  return errors;
};
