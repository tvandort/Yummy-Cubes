import { v4 } from "uuid";
import { Collection, PlayedTile } from "./tile";
import { Id } from "./id";

interface Rule {
  (tiles: PlayedTile[]): Boolean;
}

const oneColor: Rule = (tiles: PlayedTile[]) => {
  const color = tiles[0].Color;
  return tiles.every((tile) => tile.Color === color);
};

const isConsecutive: Rule = (tiles: PlayedTile[]) => {
  let offset: number | undefined;
  for (let index = 0; index < tiles.length; index++) {
    const tile = tiles[index];

    if (!offset) {
      offset = parseInt(tile.Face);
    }

    const expected = index + offset;

    if (parseInt(tile.Face) !== expected) {
      return false;
    }
  }

  return true;
};

export const mustBeThree: Rule = (tiles: PlayedTile[]) => tiles.length > 2;

export const isRun: Rule = (tiles: PlayedTile[]) => {
  return oneColor(tiles) && isConsecutive(tiles);
};

const allSameFace: Rule = (tiles: PlayedTile[]) => {
  const face = tiles[0].Face;
  return tiles.every((tile) => tile.Face === face);
};

const hasOnlyOneOfAnyColor: Rule = (tiles: PlayedTile[]) => {
  const counts: { [key: string]: number } = {};

  for (let tile of tiles) {
    const count = counts[tile.Color] ?? 0;
    counts[tile.Color] = count + 1;

    if (counts[tile.Color] > 1) {
      return false;
    }
  }

  return true;
};

export const isGroup: Rule = (tiles: PlayedTile[]) => {
  return allSameFace(tiles) && hasOnlyOneOfAnyColor(tiles);
};

const rules = [isRun, isGroup];

export class NewSet extends Collection<PlayedTile> {
  isValid() {
    return (
      mustBeThree(this.Items) && (isRun(this.Items) || isGroup(this.Items))
    );
  }
}

export class Set extends NewSet {
  private id: string;
  constructor(items: PlayedTile[], id?: string) {
    super(items);
    this.id = id ?? v4();
  }

  get Id() {
    return this.id;
  }

  from(items: PlayedTile[]) {
    return new Set(items, this.id);
  }
}
