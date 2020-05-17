import { render, fireEvent } from '@testing-library/react';
import RoomPrompt from '@app/components/roomPrompt';

test('allows room input', () => {
  const handleGo = jest.fn();
  const { getByLabelText, getByText } = render(<RoomPrompt onGo={handleGo} />);
  const input = getByLabelText('Have a room code?');
  const go = getByText('Go!');
  const roomCode = 'some-value';

  fireEvent.change(input, { target: { value: roomCode } });
  fireEvent.click(go);

  expect(handleGo).toHaveBeenCalledWith(roomCode);
});
