import { Tile, generateTiles } from "./tile";
import { shuffle } from "./random";
export class Bag {
  private tiles: Tile[];
  constructor({
    tiles
  }: {
    tiles?: Tile[];
  } = {}) {
    this.tiles = tiles ?? shuffle(generateTiles());
  }
  pick() {
    return this.tiles.shift();
  }
  drawHand() {
    const hand: Tile[] = [];
    for (let index = 0; index < 14; index++) {
      hand.push(this.pick());
    }
    return hand;
  }
  get Count() {
    return this.tiles.length;
  }
}
