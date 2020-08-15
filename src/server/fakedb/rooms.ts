import { v4 } from 'uuid';

export interface RoomLike {
  Id: string;
  Players: { userIdentifier: string }[];
  Code: string;
}

export class Room implements RoomLike {
  private id: string;
  private players: { userIdentifier: string }[];
  private code: string;

  constructor({
    id,
    code = v4(),
    players = []
  }: {
    code?: string;
    id: string;
    players?: { userIdentifier: string }[];
  }) {
    this.id = id;
    this.players = players;
    this.code = code;
  }

  get Id() {
    return this.id;
  }

  get Players() {
    return this.players;
  }

  get Code() {
    return this.code;
  }
}

export class Rooms {
  private rooms: { [key: string]: Room };
  private length: number;

  constructor({ rooms }: { rooms: Room[] } = { rooms: [] }) {
    const init: { [key: string]: Room } = {};
    this.rooms = rooms.reduce((rooms, room) => {
      rooms[room.Id] = room;
      return rooms;
    }, init);

    this.length = rooms.length;
  }

  add(room: Room) {
    if (room.Id in this.rooms) {
      throw new Error('Room already exists.');
    }

    this.rooms[room.Id] = room;
    this.length++;
  }

  remove(room: Room) {
    if (room.Id in this.rooms === false) {
      throw new Error("Room doens't exist.");
    }

    delete this.rooms[room.Id];
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
