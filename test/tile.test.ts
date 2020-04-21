import {
  generateTiles,
  colors,
  RegularTile,
  faces,
  JokerTile,
  unplayedSet,
  TileFactory
} from "../src/tile";

describe(generateTiles, () => {
  describe("generated bag", () => {
    it("generates 106 tiles", () => {
      const tiles = generateTiles();
      expect(tiles.length).toBe(106);
    });

    it("contains 2 jokers", () => {
      const tiles = generateTiles();
      const jokers = tiles.filter(JokerTile.Match);
      expect(jokers.length).toBe(2);
    });

    it.each(colors)("contains 26 tiles that are %p", (color) => {
      const tiles = generateTiles();
      const coloredTiles = tiles
        .filter(RegularTile.Match)
        .filter((tile) => tile.Color == color);
      expect(coloredTiles.length).toBe(26);
    });

    it.each(faces)("contains 8 tiles that are %p", (face) => {
      const tiles = generateTiles();
      const facedTiles = tiles
        .filter(RegularTile.Match)
        .filter((tile) => tile.Face == face);
      expect(facedTiles.length).toBe(8);
    });

    it("contains two of each tile by identity", () => {
      const tiles = generateTiles();
      const tilesCount: { [key: string]: number } = {};
      for (let { Color: color, Face: face } of tiles.filter(
        RegularTile.Match
      )) {
        const count = tilesCount[face + color];
        tilesCount[face + color] = (count ?? 0) + 1;
      }

      for (let key of Object.keys(tilesCount)) {
        const value = tilesCount[key];
        expect(value).toBe(2);
      }
    });
  });

  describe("generate manual sequence", () => {
    describe("failure", () => {
      it("throws on invalid sequences", () => {
        try {
          unplayedSet("o22");
        } catch (e) {
          expect(e.message).toEqual("Sequence has invalid identifiers.");
        }
      });
    });

    describe("success", () => {
      it("generates tiles", () => {
        const tiles = unplayedSet("r1,joker");
        expect(tiles[0]).toEqual(
          TileFactory.create({ face: "1", color: "RED" })
        );
        expect(tiles[1]).toEqual(TileFactory.Joker());
      });
    });
  });
});
