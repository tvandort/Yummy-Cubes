import RoomPrompt from '@app/components/roomPrompt';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Room Prompt'
};

export const Example = () => (
  <RoomPrompt
    onJoin={action('Go clicked: ')}
    onCreate={action('Create clicked')}
  />
);
