import RoomPrompt from '@app/components/roomPrompt';
import { GetServerSideProps } from 'next';
import { generateRoomId } from '@app/shared/generateRoomId';

interface IndexProps {
  initialRoomId: string;
}

export default function Index({ initialRoomId }: IndexProps) {
  return (
    <div className="flex justify-center items-center h-full">
      <RoomPrompt initialRoomId={initialRoomId} />
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
