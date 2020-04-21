import { mustBeThree, isRun } from "../src/set";
import { generateSequence } from "../src/tile";

describe("rules", () => {
  describe(mustBeThree, () => {
    it("passes", () => {
      expect(mustBeThree(generateSequence("r1,r1,r1"))).toBe(true);
    });

    it("does not pass", () => {
      expect(mustBeThree(generateSequence("r1"))).toBe(false);
    });
  });

  describe(isRun, () => {
    describe("pass", () => {
      it("is in order", () => {
        expect(isRun(generateSequence("r1,r2,r3"))).toBe(true);
      });

      it("has jokers", () => {
        expect(isRun(generateSequence("r1,joker,r3,joker,r5"))).toBe(true);
      });
    });

    describe("does not pass", () => {
      it("has an off color tile", () => {
        expect(isRun(generateSequence("r1,r2,r3,o1"))).toBe(false);
      });

      it("has a number that does not fit in the run", () => {
        expect(isRun(generateSequence("r1,r2,r5"))).toBe(false);
      });

      it("has more than one copy of the same number", () => {
        expect(isRun(generateSequence("r1,r1,r2"))).toBe(false);
      });

      it("has more than one copy of a number and jokers", () => {
        expect(isRun(generateSequence("r1,r1,joker"))).toBe(false);
      });

      it("is not in order", () => {
        expect(isRun(generateSequence("r3,r1,r2"))).toBe(false);
      });
    });
  });
});
