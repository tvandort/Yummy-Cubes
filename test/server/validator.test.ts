import * as D from 'io-ts/lib/Decoder';
import { validator } from '@app/server/validator';

describe('validator middlware', () => {
  it('returns status 400', () => {
    const { exampleDecoder, req, res, next, mockResponse } = setup();
    const fn = validator(exampleDecoder);

    req.body = { example: 'incorrect string' };

    fn(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' })
    );
  });

  it('makes error tree more resty', () => {
    const { exampleDecoder, req, res, next, mockResponse } = setup();
    const fn = validator(exampleDecoder);

    fn(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.objectContaining({
        error: {
          code: 'BadArgument',
          message: 'Invalid request body',
          details: [
            {
              code: 'BadArgument',
              details: [],
              message:
                'cannot decode undefined, should be Record<string, unknown>'
            }
          ]
        }
      })
    );
  });

  it('accepts a valid body', () => {
    const { exampleDecoder, req, res, next } = setup();
    const fn = validator(exampleDecoder);

    req.body = { example: 'test' };

    fn(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  const setup = () => {
    const exampleDecoder = D.type({
      example: D.union(D.literal('test'), D.literal('example'))
    });
    const mockRequest = {};
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    const mockNext = jest.fn();

    return {
      exampleDecoder,
      mockRequest,
      mockResponse,
      req: mockRequest as any,
      res: mockResponse as any,
      next: mockNext
    };
  };
});
