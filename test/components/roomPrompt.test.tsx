import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RoomPrompt from '@app/components/roomPrompt';

test('allows room input', () => {
  const handleGo = jest.fn();
  const handleCreate = jest.fn();
  const { getByLabelText, getByText } = render(
    <RoomPrompt onJoin={handleGo} onCreate={handleCreate} />
  );
  const input = getByLabelText(/If you have a room code enter it below:/);
  const go = getByText('Go!');
  const create = getByText(/Create/);
  const roomCode = 'some-value';

  fireEvent.change(input, { target: { value: roomCode } });
  fireEvent.click(go);

  expect(handleGo).toHaveBeenCalledWith(roomCode);
  expect(handleCreate).not.toHaveBeenCalled();
});

test("buttons don't fire the same events", () => {
  const handleGo = jest.fn();
  const handleCreate = jest.fn();
  const { getByText } = render(
    <RoomPrompt onJoin={handleGo} onCreate={handleCreate} />
  );
  const create = getByText(/Create/);
  const roomCode = 'some-value';

  fireEvent.click(create);

  expect(handleCreate).toHaveBeenCalled();
  expect(handleGo).not.toHaveBeenCalledWith(roomCode);
});
