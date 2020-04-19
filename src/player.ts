export interface IPlayer {
  Name: string;
}
export class Player implements IPlayer {
  private name: string;
  constructor({ name }: { name: string }) {
    this.name = name;
  }
  get Name() {
    return this.name;
  }
}
