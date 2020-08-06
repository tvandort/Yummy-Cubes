import NamePrompt from '@app/components/namePrompt';
import { useState } from 'react';
import RoomPrompt from '@app/components/roomPrompt';
import wretch, {
  ConfiguredMiddleware,
  FetchLike,
  WretcherOptions,
  WretcherResponse,
  ResponseChain
} from 'wretch';
import { Decoder } from 'io-ts/lib/Decoder';
import {
  newRoomResponseDecoder,
  newRoomRequestDecoder,
  NewRoomRequest,
  NewRoomResponse
} from '@app/shared/validators/roomTypes';
import { NextPageContext, GetServerSideProps } from 'next';
import { generateRoomId } from '@app/shared/generateRoomId';

const validatorMiddleware = <RequestType, RT>(
  decoder: Decoder<RT>
): ConfiguredMiddleware => (next: FetchLike) => (url, opts) => {
  return next(url, opts).then((response) => {
    const json = response.json();
    const decodingResult = decoder.decode(json);

    if (decodingResult._tag === 'Left') {
      throw new Error("Type couldn't decode.");
    }

    return json;
  });
};

type something<RequestType, RT> = (requestBody: RequestType) => Promise<RT>;

const createPost = <RequestType, ResponseType>(
  decoder: Decoder<ResponseType>,
  url: string,
  opts?: WretcherOptions
): something<RequestType, ResponseType> => {
  const doRequest = (body: RequestType) => {
    return wretch(url, opts)
      .middlewares([validatorMiddleware(decoder)])
      .post(body)
      .json<ResponseType>();
  };

  return doRequest;
};

const postNewRoom = createPost<NewRoomRequest, NewRoomResponse>(
  newRoomResponseDecoder,
  'test'
);
const test = async () => {
  const asd = postNewRoom({ name: 'tom' });
};

interface IndexProps {
  initialRoomId: string;
}

export default function Index({ initialRoomId }: IndexProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <RoomPrompt onJoin={() => {}} initialRoomId={initialRoomId} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  return {
    props: {
      initialRoomId: generateRoomId()
    }
  };
};
