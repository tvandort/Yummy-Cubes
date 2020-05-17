import { render, fireEvent } from '@testing-library/react';
import NamePrompt from '@app/components/namePrompt';

test('allows name to be changed', () => {
  const handleChangeName = jest.fn();
  const { getByLabelText, getByText } = render(
    <NamePrompt onGo={handleChangeName} />
  );
  const input = getByLabelText("What's your name?");
  const go = getByText('Go!');

  expect(input).toBeInTheDocument();
  expect(go).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'Karkat' } });
  fireEvent.click(go);

  expect(handleChangeName).toHaveBeenCalledWith('Karkat');
});
