import { v4 } from "uuid";
import { UnplayedTile } from "./tile";

export interface IPlayer {
  Name: string;
  Id: string;
}

interface IInitializedPlayer {
  InitialHand: UnplayedTile[] | undefined;
}

export interface IPlayerContructor {
  name: string;
  initialHand?: UnplayedTile[];
}

export class Player implements IPlayer, IInitializedPlayer {
  private name: string;
  private id: string;
  private initialHand: UnplayedTile[] | undefined;

  constructor({ name, initialHand }: IPlayerContructor) {
    this.name = name;
    this.id = v4();
    this.initialHand = initialHand;
  }

  get Name() {
    return this.name;
  }

  get Id() {
    return this.id;
  }

  get InitialHand() {
    return this.initialHand;
  }
}
