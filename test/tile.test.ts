import { generateTiles, JOKER, colors, faces } from "../src/tile";

describe(generateTiles, () => {
  describe("generated bag", () => {
    it("generates 106 tiles", () => {
      const tiles = generateTiles();
      expect(tiles.length).toBe(106);
    });

    it("contains 2 jokers", () => {
      const tiles = generateTiles();
      const jokers = tiles.filter(
        (tile) => tile.face == JOKER && tile.color == JOKER
      );
      expect(jokers.length).toBe(2);
    });

    it.each(colors)("contains 26 tiles that are %p", (color) => {
      const tiles = generateTiles();
      const coloredTiles = tiles.filter((tile) => tile.color == color);
      expect(coloredTiles.length).toBe(26);
    });

    it.each(faces)("contains 8 tiles that are %p", (face) => {
      const tiles = generateTiles();
      const facedTiles = tiles.filter((tile) => tile.face == face);
      expect(facedTiles.length).toBe(8);
    });

    it("contains two of each tile by identity", () => {
      const tiles = generateTiles();
      const tilesCount: { [key: string]: number } = {};
      for (let { color, face } of tiles) {
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
