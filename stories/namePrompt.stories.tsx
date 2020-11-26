import NamePrompt from '@app/components/namePrompt';
import { action } from '@storybook/addon-actions';
export default {
  title: 'Name Prompt'
};

export const Example = () => <NamePrompt onGo={action(`Go! clicked:`)} />;
