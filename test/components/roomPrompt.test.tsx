import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RoomPrompt from '@app/components/roomPrompt';

test('allows room input', () => {
  const handleGo = jest.fn();
  const { getByLabelText, getByText } = render(
    <RoomPrompt onJoin={handleGo} initialRoomId="example-initial-id" />
  );
  const input = getByLabelText(/If you have a room code enter it below:/);
  const go = getByText('Go!');
  const roomCode = 'some-value';

  fireEvent.change(input, { target: { value: roomCode } });
  fireEvent.click(go);

  expect(handleGo).toHaveBeenCalledWith(roomCode);
});

test('room prompt has placeholder and starts with value', () => {
  const initialRoomId = 'look-for-me';
  const { getByPlaceholderText, getByDisplayValue } = render(
    <RoomPrompt onJoin={jest.fn()} initialRoomId={initialRoomId} />
  );

  expect(getByPlaceholderText('e.g. horse-battery-staple')).toBeTruthy();
  expect(getByDisplayValue(initialRoomId)).toBeTruthy();
});
