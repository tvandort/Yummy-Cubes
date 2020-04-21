import { mustBeThree, isRun } from "../src/set";
import { unplayedSet } from "../src/tile";

describe("rules", () => {
  describe("Require 3 tiles", () => {
    it("passes", () => {
      expect(mustBeThree(unplayedSet("r1,r1,r1"))).toBe(true);
    });

    it("does not pass", () => {
      expect(mustBeThree(unplayedSet("r1"))).toBe(false);
    });
  });

  describe("Require valid run", () => {
    describe("pass", () => {
      it("is in order", () => {
        expect(isRun(unplayedSet("r1,r2,r3"))).toBe(true);
      });

      it("has jokers", () => {
        expect(isRun(unplayedSet("r1,j,r3,j,r5"))).toBe(true);
      });

      it("can start later in a sequece", () => {
        expect(isRun(unplayedSet("r5,r6,r7")));
      });
    });

    describe("does not pass", () => {
      it("has an off color tile", () => {
        expect(isRun(unplayedSet("r1,r2,r3,o1"))).toBe(false);
      });

      it("has a number that does not fit in the run", () => {
        expect(isRun(unplayedSet("r1,r2,r5"))).toBe(false);
      });

      it("has more than one copy of the same number", () => {
        expect(isRun(unplayedSet("r1,r1,r2"))).toBe(false);
      });

      it("has more than one copy of a number and jokers", () => {
        expect(isRun(unplayedSet("r1,r1,j"))).toBe(false);
      });

      it("is not in order", () => {
        expect(isRun(unplayedSet("r3,r1,r2"))).toBe(false);
      });

      describe("impossible sequences", () => {
        it("joker joker 1", () => {
          expect(isRun(unplayedSet("j,j,r1"))).toBe(false);
        });

        it("joker 1 joker", () => {
          expect(isRun(unplayedSet("j,r1,j"))).toBe(false);
        });

        it("13 joker joker", () => {
          expect(isRun(unplayedSet("r13,j,j"))).toBe(false);
        });

        it("joker 13 joker", () => {
          expect(isRun(unplayedSet("j,r13,j"))).toBe(false);
        });
      });
    });
  });
});
