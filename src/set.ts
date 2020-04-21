import { Collection, Tile, JokerTile, RegularTile } from "./tile";

interface Rule {
  (tiles: Tile[]): Boolean;
}

const split = (tiles: Tile[]) => ({
  jokers: tiles.filter(JokerTile.Match),
  rest: tiles.filter(RegularTile.Match)
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

    if (RegularTile.Match(tile)) {
      if (!offset) {
        offset = parseInt(tile.Face);
      }

      const expected = index + offset;

      console.log(offset, expected, tile.Face);

      if (parseInt(tile.Face) !== expected) {
        return false;
      }
    }
  }

  return true;
};
export const mustBeThree: Rule = (tiles: Tile[]) => tiles.length > 2;
export const isRun: Rule = (tiles: Tile[]) => {
  return oneColor(tiles) && isConsecutive(tiles);
};

const rules = [mustBeThree, isRun];

export class Set extends Collection<Tile> {
  valid() {
    return false;
  }
}
