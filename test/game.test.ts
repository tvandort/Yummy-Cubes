import { Game, Set } from "../src/game";
import { Player, IPlayerContructor } from "../src/player";
import { generateSequence } from "../src/tile";

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

    it("disallows drawing if tiles have been placed this turn", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: generateSequence("r10,o10,b10,u10,r1") }
      });

      const [r10, o10, b10] = tom.Hand;

      tom.playFromHand([r10, o10, b10]);

      expect(game.Sets.at(0)).toEqual(new Set([r10, o10, b10]));

      expect(() => tom.draw()).toThrowError(
        "Tom cannot draw because they have placed tiles on the board!"
      );
    });
  });

  describe("playing tiles", () => {
    it("plays tiles from hand to a set", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: generateSequence("r10,o10,u10,r1") }
      });
      const hand = tom.Hand;

      expect(game.Sets.Count).toBe(0);

      tom.playFromHand([hand.at(0), hand.at(1), hand.at(2)]);

      expect(game.Sets.Count).toBe(1);
    });

    it("disallows playing tiles that are not in hand", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: generateSequence("r10,o10,u10,r1") }
      });

      expect(game.Sets.Count).toBe(0);

      expect(() => tom.playFromHand(generateSequence("r1,r1"))).toThrowError(
        "Tom tried to play tiles that they don't have in their hand."
      );

      expect(game.Sets.Count).toBe(0);
    });

    it("disallows placing when it is not players turn", () => {
      const { eileen, game } = setupGame({
        eileen: { initialHand: generateSequence("r10,o10,u10,r1") }
      });
      const hand = eileen.Hand;

      expect(game.Sets.Count).toBe(0);

      expect(() =>
        eileen.playFromHand([hand.at(0), hand.at(1), hand.at(2)])
      ).toThrowError("Not Eileen's turn!");

      expect(game.Sets.Count).toBe(0);
    });
  });

  describe("ending turn", () => {
    it("not allowed if board is in an invalid state", () => {});

    it("not allowed if board is in valid state and tile drawn", () => {});
  });

  describe("melding", () => {
    it("disallows tile playing unless they would cause a meld if player isn't melded", () => {});

    it("playing 30 > points makes a melt happen", () => {});

    it("more tiles can be played after a meld", () => {});
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
