import { Tiles, Tile, JOKER } from "./tile";

interface Rule {
  (tiles: Tile[]): Boolean;
}

const split = (tiles: Tile[]) => ({
  jokers: tiles.filter((tile) => tile.Face === JOKER),
  rest: tiles.filter((tile) => tile.Face !== JOKER)
});

const oneColor: Rule = (tiles: Tile[]) => {
  const { rest } = split(tiles);
  const color = rest[0].Color;
  return rest.every((tile) => tile.Color === color);
};
const isConsecutive: Rule = (tiles: Tile[]) => {
  let offset: number | undefined;
  for (let index = 0; index < tiles.length; index++) {
    const tile = tiles[index];
    if (tile.isJoker) {
      continue;
    }

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
export const mustBeThree: Rule = (tiles: Tile[]) => tiles.length > 2;
export const isRun: Rule = (tiles: Tile[]) => {
  return oneColor(tiles) && isConsecutive(tiles);
};

const rules = [mustBeThree, isRun];

export class Set extends Tiles {
  valid() {
    return false;
  }
}
