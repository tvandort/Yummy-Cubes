import RoomPrompt from '@app/components/roomPrompt';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Room Prompt'
};

export const Example = () => (
  <RoomPrompt initialRoomId="this-is-a-placeholder?" />
);
