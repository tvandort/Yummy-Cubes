import { Game } from "../src/game";
import { Player } from "../src/player";

describe(Game, () => {
  it("deals hands to players", () => {
    const { players } = setupPlayers();
    const game = new Game({ players });

    const player = game.CurrentPlayer;

    expect(player.Hand.length).toBe(14);
  });

  describe("turns", () => {
    it("drawing", () => {
      const {
        players,
        tom: { Id: tomsId },
        eileen: { Id: elieensId }
      } = setupPlayers();
      const game = new Game({ players });

      expect(game.CurrentPlayer.Id).toBe(tomsId);

      let tom = game.getPlayer(tomsId);
      let elieen = game.getPlayer(elieensId);

      expect(tom).toBeTruthy();
      expect(elieen).toBeTruthy();

      tom = tom!;
      elieen = elieen!;

      expect(tom.Id).toBe(tomsId);

      tom.draw();

      expect(game.CurrentPlayer.Id).toBe(elieensId);
    });
  });

  const setupPlayers = () => {
    const tom = new Player({ name: "Tom" });
    const eileen = new Player({ name: "Eileen" });
    const hannah = new Player({ name: "Hannah" });
    const players = [tom, eileen, hannah];

    return {
      tom,
      eileen,
      hannah,
      players
    };
  };
});
