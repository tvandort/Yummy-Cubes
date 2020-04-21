import { Collection, UnplayedTile, JokerTile, RegularTile } from "./tile";

interface Rule {
  (tiles: UnplayedTile[]): Boolean;
}

const split = (tiles: UnplayedTile[]) => ({
  jokers: tiles.filter(JokerTile.Match),
  rest: tiles.filter(RegularTile.Match)
});

const oneColor: Rule = (tiles: UnplayedTile[]) => {
  const { rest } = split(tiles);
  const color = rest[0].Color;
  return rest.every((tile) => tile.Color === color);
};
const isConsecutive: Rule = (tiles: UnplayedTile[]) => {
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
export const mustBeThree: Rule = (tiles: UnplayedTile[]) => tiles.length > 2;
export const isRun: Rule = (tiles: UnplayedTile[]) => {
  return oneColor(tiles) && isConsecutive(tiles);
};

const rules = [mustBeThree, isRun];

export class Set extends Collection<UnplayedTile> {
  valid() {
    return false;
  }
}
