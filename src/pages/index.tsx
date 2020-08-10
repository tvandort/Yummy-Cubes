import RoomPrompt from '@app/components/roomPrompt';
import {
  newRoomResponseDecoder,
  NewRoomRequest,
  NewRoomResponse
} from '@app/shared/validators/roomTypes';
import { GetServerSideProps } from 'next';
import { generateRoomId } from '@app/shared/generateRoomId';
import { createPost } from '@app/shared/requestGenerator';

const joinRoom = createPost<NewRoomRequest, NewRoomResponse>(
  newRoomResponseDecoder,
  'api/rooms'
);

interface IndexProps {
  initialRoomId: string;
}

export default function Index({ initialRoomId }: IndexProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <RoomPrompt
        onJoin={(code) => {
          joinRoom({ roomId: code });
        }}
        initialRoomId={initialRoomId}
      />
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
