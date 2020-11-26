import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NamePrompt from '@app/components/namePrompt';

test('allows name to be changed', () => {
  const handleGo = jest.fn();
  const { getByLabelText, getByText } = render(<NamePrompt onGo={handleGo} />);
  const input = getByLabelText("What's your name?");
  const go = getByText('Go!');
  const name = 'Karkat';

  fireEvent.change(input, { target: { value: name } });
  fireEvent.click(go);

  expect(handleGo).toHaveBeenCalledWith(name);
});
