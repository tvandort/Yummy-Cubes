import { Game } from "../src/game";
import { Player, IPlayerContructor } from "../src/player";
import { generateSequence } from "../src/tile";
import { Bag } from "../src/bag";

describe(Game, () => {
  it("deals hands to players", () => {
    const { players } = setupPlayers();
    const game = new Game({ players });

    const player = game.CurrentPlayer;

    expect(player.Hand.Count).toBe(14);
  });

  describe("turns", () => {
    it("drawing", () => {
      const { tom, eileen, game } = setupGame();

      tom.draw();

      expect(game.CurrentPlayer.Id).toBe(eileen.Id);
    });

    it("disallows drawing when it is not players turn", () => {
      const { eileen } = setupGame();

      expect(() => eileen.draw()).toThrowError("Not Eileen's turn!");
    });
  });

  describe("playing tiles", () => {
    it("plays tiles from hand to a set", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: generateSequence("r10,o10,u10,r1") }
      });
      const hand = tom.Hand;

      expect(game.Sets.length).toBe(0);

      tom.place([hand.at(0), hand.at(1), hand.at(2)]);

      expect(game.Sets.length).toBe(1);
    });

    it("disallows playing tiles that are not in hand", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: generateSequence("r10,o10,u10,r1") }
      });

      expect(game.Sets.length).toBe(0);

      expect(() => tom.place(generateSequence("r1,r1"))).toThrowError(
        "Tom tried to play tiles that they don't have in their hand."
      );

      expect(game.Sets.length).toBe(0);
    });

    it("disallows placing when it is not players turn", () => {
      const { eileen, game } = setupGame({
        eileen: { initialHand: generateSequence("r10,o10,u10,r1") }
      });
      const hand = eileen.Hand;

      expect(game.Sets.length).toBe(0);

      expect(() =>
        eileen.place([hand.at(0), hand.at(1), hand.at(2)])
      ).toThrowError("Not Eileen's turn!");

      expect(game.Sets.length).toBe(0);
    });
  });

  const setupGame = (args: Partial<SetupPlayersArgs> = {}) => {
    const {
      players,
      tom: { Id: tomsId },
      eileen: { Id: eileensId },
      hannah: { Id: hannahsId }
    } = setupPlayers(args);
    const game = new Game({ players });

    expect(game.CurrentPlayer.Id).toBe(tomsId);

    let tom = game.getPlayer(tomsId);
    let eileen = game.getPlayer(eileensId);
    let hannah = game.getPlayer(hannahsId);

    expect(tom).toBeTruthy();
    expect(eileen).toBeTruthy();
    expect(hannah).toBeTruthy();

    tom = tom!;
    eileen = eileen!;
    hannah = hannah!;

    expect(tom.Id).toBe(tomsId);
    expect(eileen.Id).toBe(eileensId);
    expect(hannah.Id).toBe(hannahsId);

    return {
      tom,
      eileen,
      hannah,
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
