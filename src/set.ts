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

const rules = [mustBeThree, isRun, isGroup];

export class Set extends Collection<PlayedTile> {
  valid() {
    return false;
  }
}
