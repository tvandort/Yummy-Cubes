export interface Room {
  id: string;
  players: { userIdentifier: string }[];
}

export class Rooms {
  private rooms: { [key: string]: Room };
  private length: number;

  constructor({ rooms }: { rooms: Room[] } = { rooms: [] }) {
    const init: { [key: string]: Room } = {};
    this.rooms = rooms.reduce((rooms, room) => {
      rooms[room.id] = room;
      return rooms;
    }, init);

    this.length = rooms.length;
  }

  add(room: Room) {
    if (room.id in this.rooms) {
      throw new Error('Room already exists.');
    }

    this.rooms[room.id] = room;
    this.length++;
  }

  remove(room: Room) {
    if (room.id in this.rooms === false) {
      throw new Error("Room doens't exist.");
    }

    delete this.rooms[room.id];
    this.length--;
  }

  exists(id: string) {
    return id in this.rooms;
  }

  get Length() {
    return this.length;
  }

  clear() {
    this.rooms = {};
    this.length = 0;
  }

  get(id: string) {
    if (!this.exists(id)) {
      throw new Error(`Room with Id ${id} does not exist.`);
    }

    return this.rooms[id];
  }
}

const _rooms = new Rooms();

export default _rooms;
