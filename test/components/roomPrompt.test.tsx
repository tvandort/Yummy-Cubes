import { render, fireEvent } from '@testing-library/react';
import RoomPrompt from '@app/components/roomPrompt';

test('allows room input', () => {
  const handleGo = jest.fn();
  const { getByLabelText, getByText } = render(
    <RoomPrompt onGo={handleGo} name="Karkat" />
  );
  const input = getByLabelText(/If you have a room code enter it below:/);
  const go = getByText('Go!');
  const roomCode = 'some-value';

  fireEvent.change(input, { target: { value: roomCode } });
  fireEvent.click(go);

  expect(handleGo).toHaveBeenCalledWith(roomCode);
});
