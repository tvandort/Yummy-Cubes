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

  draw(): Tile {
    if (this.tiles.length > 0) {
      return this.tiles.shift()!;
    }

    throw new Error("Out of tiles.");
  }

  drawHand() {
    const hand: Tile[] = [];
    for (let index = 0; index < 14; index++) {
      hand.push(this.draw());
    }
    return hand;
  }

  get Count() {
    return this.tiles.length;
  }
}
