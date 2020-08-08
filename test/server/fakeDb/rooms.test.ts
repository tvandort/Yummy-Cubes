import { Rooms } from '@app/server/fakedb/rooms';

describe('Rooms', () => {
  test('adding a room twice causes an exception', () => {
    const rooms = new Rooms();

    rooms.add({ id: 'first-room' });

    expect(() =>
      rooms.add({ id: 'first-room' })
    ).toThrowErrorMatchingInlineSnapshot(`"Room already exists."`);
  });

  test('adding two rooms is fine', () => {
    const rooms = new Rooms();

    rooms.add({ id: 'first-room' });
    rooms.add({ id: 'second-room' });

    expect(rooms.Length).toBe(2);
  });

  test('that clear removes all rooms', () => {
    const rooms = new Rooms();

    rooms.add({ id: 'test' });

    expect(rooms.Length).toBe(1);

    rooms.clear();

    expect(rooms.Length).toBe(0);
  });

  test('that removing a room removes it', () => {
    const rooms = new Rooms();

    rooms.add({ id: 'test' });

    expect(rooms.Length).toBe(1);

    rooms.remove({ id: 'test' });

    expect(rooms.Length).toBe(0);
  });
});
