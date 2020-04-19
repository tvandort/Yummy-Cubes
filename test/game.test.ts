import { Game } from "../src/game";
import { Player } from "../src/player";

describe(Game, () => {
  it("deals hands to players", () => {
    const { players } = setupPlayers();
    const game = new Game({ players });

    const player = game.CurrentPlayer;

    expect(player.Hand.length).toBe(14);
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
