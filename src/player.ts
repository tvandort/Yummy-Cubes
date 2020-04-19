import { v4 } from "uuid";

export interface IPlayer {
  Name: string;
}
export class Player implements IPlayer {
  private name: string;
  private id: string;

  constructor({ name }: { name: string }) {
    this.name = name;
    this.id = v4();
  }
  get Name() {
    return this.name;
  }

  get Id() {
    return this.id;
  }
}
