import { Game } from "../src/game";
import { Player, IPlayerContructor } from "../src/player";

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

  interface SetupPlayersArgs {
    tom: Partial<IPlayerContructor>;
    eileen: Partial<IPlayerContructor>;
    hannah: Partial<IPlayerContructor>;
  }

  interface SetupPlayers {
    tom: Player;
    eileen: Player;
    hannah: Player;
    players: Player[];
  }

  const setupPlayers = ({
    tom: partialTom,
    eileen: partialEileen,
    hannah: partialHannah
  }: Partial<SetupPlayersArgs> = {}): SetupPlayers => {
    const tom = new Player({ name: "Tom", ...partialTom });
    const eileen = new Player({ name: "Eileen", ...partialEileen });
    const hannah = new Player({ name: "Hannah", ...partialHannah });
    const players = [tom, eileen, hannah];

    return {
      tom,
      eileen,
      hannah,
      players
    };
  };
});
