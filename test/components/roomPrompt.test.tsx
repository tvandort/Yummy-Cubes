import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RoomPrompt from '@app/components/roomPrompt';

test('allows room input', () => {
  const { getByLabelText, getByText } = render(
    <RoomPrompt initialRoomId="example-initial-id" />
  );
  const go = getByText('Go!');

  expect(go).toHaveAttribute('href', 'room/example-initial-id');

  const input = getByLabelText(/If you have a room code enter it below:/);
  const roomCode = 'some-value';

  fireEvent.change(input, { target: { value: roomCode } });

  expect(go).toHaveAttribute('href', 'room/some-value');
});

test('room prompt has placeholder and starts with value', () => {
  const initialRoomId = 'look-for-me';
  const { getByPlaceholderText, getByDisplayValue } = render(
    <RoomPrompt initialRoomId={initialRoomId} />
  );

  expect(getByPlaceholderText('e.g. horse-battery-staple')).toBeTruthy();
  expect(getByDisplayValue(initialRoomId)).toBeTruthy();
});
