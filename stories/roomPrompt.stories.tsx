import RoomPrompt from '../src/components/roomPrompt';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Room Prompt'
};

export const Example = () => <RoomPrompt onGo={action('Go clicked: ')} />;
