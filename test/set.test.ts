import { mustBeThree, isRun, isGroup } from "../src/set";
import { playedSet } from "../src/tile";

describe("rules", () => {
  describe("Require 3 tiles", () => {
    it("passes", () => {
      expect(mustBeThree(playedSet("r1,r1,r1"))).toBe(true);
    });

    it("does not pass", () => {
      expect(mustBeThree(playedSet("r1"))).toBe(false);
    });
  });

  describe("Require valid run", () => {
    describe("pass", () => {
      it("is in order", () => {
        expect(isRun(playedSet("r1,r2,r3"))).toBe(true);
      });

      it("has jokers", () => {
        expect(isRun(playedSet("r1,jr2,r3,jr4,r5"))).toBe(true);
      });

      it("can start later in a sequece", () => {
        expect(isRun(playedSet("r5,r6,r7")));
      });
    });

    describe("does not pass", () => {
      it("has an off color tile", () => {
        expect(isRun(playedSet("r1,r2,r3,o1"))).toBe(false);
      });

      it("has a number that does not fit in the run", () => {
        expect(isRun(playedSet("r1,r2,r5"))).toBe(false);
      });

      it("has more than one copy of the same number", () => {
        expect(isRun(playedSet("r1,r1,r2"))).toBe(false);
      });

      it("has more than one copy of a number and jokers", () => {
        expect(isRun(playedSet("r1,r1,jr2"))).toBe(false);
      });

      it("is not in order", () => {
        expect(isRun(playedSet("r3,r1,r2"))).toBe(false);
      });

      describe("impossible sequences", () => {
        it("joker joker 1", () => {
          expect(isRun(playedSet("jr1,jr1,r1"))).toBe(false);
        });

        it("joker 1 joker", () => {
          expect(isRun(playedSet("jr1,r1,jr1"))).toBe(false);
        });

        it("13 joker joker", () => {
          expect(isRun(playedSet("r13,jr1,jr1"))).toBe(false);
        });

        it("joker 13 joker", () => {
          expect(isRun(playedSet("jr1,r13,jr1"))).toBe(false);
        });
      });
    });
  });

  describe("Require valid group", () => {
    describe("pass", () => {
      it("is 3 color match", () => {
        expect(isGroup(playedSet("r1,o1,u1"))).toBe(true);
      });

      it("is 4 tile group", () => {
        expect(isGroup(playedSet("r1,o1,u1"))).toBe(true);
      });

      it("is max joker group", () => {
        expect(isGroup(playedSet("jr1,ju1,o1"))).toBe(true);
      });
    });

    describe("fail", () => {
      it("has faces that do not match", () => {
        expect(isGroup(playedSet("r1,o2,u1"))).toBe(false);
      });

      it("has duplicated colors", () => {
        expect(isGroup(playedSet("r1,r1,o1"))).toBe(false);
      });
    });
  });
});
