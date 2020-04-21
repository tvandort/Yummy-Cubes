import { UnplayedTile, generateTiles } from "./tile";
import { shuffle } from "./random";
export class Bag {
  private tiles: UnplayedTile[];
  constructor({
    tiles
  }: {
    tiles?: UnplayedTile[];
  } = {}) {
    this.tiles = tiles ?? shuffle(generateTiles());
  }

  draw(): UnplayedTile {
    if (this.tiles.length > 0) {
      return this.tiles.shift()!;
    }

    throw new Error("Out of tiles.");
  }

  drawHand() {
    const hand: UnplayedTile[] = [];
    for (let index = 0; index < 14; index++) {
      hand.push(this.draw());
    }
    return hand;
  }

  get Count() {
    return this.tiles.length;
  }

  removeTiles(tilesToRemoves: UnplayedTile[]) {
    for (let tileToRemove of tilesToRemoves) {
      this.removeTile(tileToRemove);
    }
  }

  removeTile(tileToDelete: UnplayedTile) {
    for (let index = 0; index < this.tiles.length; index++) {
      const tile = this.tiles[index];
      if (tile.Id === tileToDelete.Id) {
        this.tiles.splice(index, 1);
        return;
      }
    }
  }

  toString() {
    return this.tiles.map((tile) => tile.Id).join(",");
  }
}
