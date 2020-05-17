import NamePrompt from '../src/components/namePrompt';
import { action } from '@storybook/addon-actions';
export default {
  title: 'Name Prompt'
};

export const Example = () => <NamePrompt onChange={action(`Go! clicked:`)} />;
