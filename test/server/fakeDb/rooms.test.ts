import { Rooms } from '@app/server/fakedb/rooms';

describe('Rooms', () => {
  test('adding a room twice causes an exception', () => {
    const rooms = new Rooms();

    rooms.add(makeRoom('first-room'));

    expect(() =>
      rooms.add(makeRoom('first-room'))
    ).toThrowErrorMatchingInlineSnapshot(`"Room already exists."`);
  });

  test('adding two rooms is fine', () => {
    const rooms = new Rooms();

    rooms.add(makeRoom('first-room'));
    rooms.add(makeRoom('second-room'));

    expect(rooms.Length).toBe(2);
  });

  test('that clear removes all rooms', () => {
    const rooms = new Rooms();

    rooms.add(makeRoom('test'));

    expect(rooms.Length).toBe(1);

    rooms.clear();

    expect(rooms.Length).toBe(0);
  });

  test('that removing a room removes it', () => {
    const rooms = new Rooms();
    rooms.add(makeRoom('test'));

    expect(rooms.Length).toBe(1);

    rooms.remove(makeRoom('test'));

    expect(rooms.Length).toBe(0);
  });

  test('can check that rooms exists', () => {
    const rooms = new Rooms();
    const id = 'test';

    expect(rooms.exists(id)).toBeFalsy();

    rooms.add(makeRoom(id));

    expect(rooms.exists(id)).toBeTruthy();
  });

  test('can get room', () => {
    const rooms = new Rooms();
    rooms.add(makeRoom('test'));

    const room = rooms.get('test');

    expect(room).toMatchInlineSnapshot(`
      Object {
        "id": "test",
        "players": Array [],
      }
    `);
  });

  test('that getting a room that doesnt exist throws', () => {
    const rooms = new Rooms();

    expect(() => rooms.get('test')).toThrowErrorMatchingInlineSnapshot(
      `"Room with Id test does not exist."`
    );
  });

  const makeRoom = (identifier: string) => ({ id: identifier, players: [] });
});
