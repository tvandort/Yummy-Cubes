import { Game } from "../src/game";
import { Player, IPlayerContructor } from "../src/player";
import { generateSequence } from "../src/tile";
import { Bag } from "../src/bag";

describe(Game, () => {
  it("deals hands to players", () => {
    const { players } = setupPlayers();
    const game = new Game({ players });

    const player = game.CurrentPlayer;

    expect(player.Hand.length).toBe(14);
  });

  describe("turns", () => {
    it("drawing", () => {
      const { tom, eileen, game } = setupBasicGame();

      tom.draw();

      expect(game.CurrentPlayer.Id).toBe(eileen.Id);
    });

    it("disallows drawing when it is not players turn", () => {
      const { eileen } = setupBasicGame();

      expect(() => eileen.draw()).toThrowError("Not Eileen's turn!");
    });
  });

  const setupBasicGame = () => {
    const {
      players,
      tom: { Id: tomsId },
      eileen: { Id: eileensId }
    } = setupPlayers();
    const game = new Game({ players });

    expect(game.CurrentPlayer.Id).toBe(tomsId);

    let tom = game.getPlayer(tomsId);
    let eileen = game.getPlayer(eileensId);

    expect(tom).toBeTruthy();
    expect(eileen).toBeTruthy();

    tom = tom!;
    eileen = eileen!;

    expect(tom.Id).toBe(tomsId);
    expect(eileen.Id).toBe(eileensId);

    return {
      tom,
      eileen,
      game
    };
  };

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
