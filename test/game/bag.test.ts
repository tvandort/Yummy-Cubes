import { Bag } from "@app/game/bag";
import { unplayedSet, TileFactory } from "@app/game/tile";

describe(Bag, () => {
  describe("draw", () => {
    it("removes a tile and returns it", () => {
      const bag = new Bag({ tiles: unplayedSet("r1,u1") });

      expect(bag.Count).toBe(2);

      const drawn = bag.draw();

      expect(drawn.Id).toBe("r1");
      expect(bag.Count).toBe(1);
    });
  });

  describe("removing tiles", () => {
    it("removes a tile", () => {
      const bag = new Bag({ tiles: unplayedSet("r1,o1,r1,u1,u1") });

      expect(bag.Count).toBe(5);

      bag.removeTile(TileFactory.create({ face: "1", color: "RED" }));

      expect(bag.Count).toBe(4);
      expect(bag.toString()).toBe("o1,r1,u1,u1");
    });

    it("removes many tiles", () => {
      const bag = new Bag({ tiles: unplayedSet("r1,o1,r1,u1,u1") });

      expect(bag.Count).toBe(5);

      bag.removeTiles(unplayedSet("o1,u1"));

      expect(bag.Count).toBe(3);
      expect(bag.toString()).toBe("r1,r1,u1");
    });
  });
});
