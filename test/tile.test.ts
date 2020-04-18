import { buildBag, JOKER, colors, faces } from "../src/tile";

describe(buildBag, () => {
  describe("generated bag", () => {
    it("generates 106 tiles", () => {
      const bag = buildBag();
      expect(bag.length).toBe(106);
    });

    it("contains 2 jokers", () => {
      const bag = buildBag();
      const jokers = bag.filter(
        (tile) => tile.face == JOKER && tile.color == JOKER
      );
      expect(jokers.length).toBe(2);
    });

    it.each(colors)("contains 26 tiles that are %p", (color) => {
      const bag = buildBag();
      const coloredTiles = bag.filter((tile) => tile.color == color);
      expect(coloredTiles.length).toBe(26);
    });

    it.each(faces)("contains 8 tiles that are %p", (face) => {
      const bag = buildBag();
      const facedTiles = bag.filter((tile) => tile.face == face);
      expect(facedTiles.length).toBe(8);
    });

    it("contains two of each tile by identity", () => {
      const bag = buildBag();
      const tilesCount: { [key: string]: number } = {};
      for (let { color, face } of bag) {
        const count = tilesCount[face + color];
        tilesCount[face + color] = (count ?? 0) + 1;
      }

      for (let key of Object.keys(tilesCount)) {
        const value = tilesCount[key];
        expect(value).toBe(2);
      }
    });
  });
});
