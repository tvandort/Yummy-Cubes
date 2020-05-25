export interface Room {
  id: string;
}

export class Rooms {
  private rooms: { [key: string]: Room };

  constructor({ rooms }: { rooms: Room[] } = { rooms: [] }) {
    const init: { [key: string]: Room } = {};
    this.rooms = rooms.reduce((rooms, room) => {
      rooms[room.id] = room;
      return rooms;
    }, init);
  }

  add(room: Room) {
    if (room.id in rooms) {
      throw new Error('Room already exists.');
    }

    this.rooms[room.id] = room;
  }
}

const rooms = new Rooms();

export default rooms;
