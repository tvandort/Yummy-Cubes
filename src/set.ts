import { Collection, JokerTile, RegularTile, PlayedTile } from "./tile";

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

const rules = [mustBeThree, isRun];

export class Set extends Collection<PlayedTile> {
  valid() {
    return false;
  }
}
