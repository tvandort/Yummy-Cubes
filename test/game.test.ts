import { Game } from "../src/game";
import { Set } from "../src/set";
import { Player, IPlayerContructor } from "../src/player";
import { unplayedSet, playedSet, RegularTile, PlayedTile } from "../src/tile";

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
        tom: { initialHand: playedSet("r10,o10,b10,u10,r1") }
      });

      const [r10, o10, b10] = tom.Hand;

      tom.playFromHand([r10, o10, b10] as PlayedTile[]);

      expect(game.Sets.at(0)).toEqual(
        new Set([r10, o10, b10] as RegularTile[])
      );

      expect(() => tom.draw()).toThrowError(
        "Tom cannot draw because they have placed tiles on the board!"
      );
    });
  });

  describe("playing tiles", () => {
    it("plays tiles from hand to a set", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: unplayedSet("r10,o10,u10,r1") }
      });
      const hand = tom.Hand;

      expect(game.Sets.Count).toBe(0);

      tom.playFromHand([hand.at(0), hand.at(1), hand.at(2)] as PlayedTile[]);

      expect(game.Sets.Count).toBe(1);
    });

    it("disallows playing tiles that are not in hand", () => {
      const { tom, game } = setupGame({
        tom: { initialHand: unplayedSet("r10,o10,u10,r1") }
      });

      expect(game.Sets.Count).toBe(0);

      expect(() => tom.playFromHand(playedSet("r1,r1"))).toThrowError(
        "Tom tried to play tiles that they don't have in their hand."
      );

      expect(game.Sets.Count).toBe(0);
    });

    it("disallows placing when it is not players turn", () => {
      const { eileen, game } = setupGame({
        eileen: { initialHand: unplayedSet("r10,o10,u10,r1") }
      });
      const hand = eileen.Hand;

      expect(game.Sets.Count).toBe(0);

      expect(() =>
        eileen.playFromHand([
          hand.at(0),
          hand.at(1),
          hand.at(2)
        ] as PlayedTile[])
      ).toThrowError("Not Eileen's turn!");

      expect(game.Sets.Count).toBe(0);
    });
  });

  describe("ending turn", () => {
    it("is not allowed if board is in an invalid state", () => {
      const { tom } = setupGame({
        tom: { initialHand: unplayedSet("r10,o10,u10,r1,u1") }
      });
      const [r10, o10, u10, r1] = tom.Hand;

      tom.playFromHand([r10, o10, u10, r1] as PlayedTile[]);

      expect(() => tom.endTurn()).toThrowError(
        "Board is not in a valid state!"
      );
    });

    it("cannot be ended by a player if it is not their turn", () => {
      const { eileen } = setupGame();

      expect(() => eileen.endTurn()).toThrowError("Not Eileen's turn!");
    });

    it("is not allowed if player has not played tiles", () => {
      const { tom } = setupGame();

      expect(() => tom.endTurn()).toThrowError("Tom has not melded this turn!");
    });
  });

  describe("melding", () => {
    it("disallows ending turn unless they would cause a meld if player isn't melded", () => {
      const { tom } = setupGame({
        tom: { initialHand: unplayedSet("r1,r2,r3") }
      });
      const [r1, r2, r3] = tom.Hand;

      tom.playFromHand([r1, r2, r3].filter(RegularTile.Match));

      expect(() => tom.endTurn()).toThrowError("Tom hasn't melded yet.");
    });

    it("playing 29 > points makes a melt happen", () => {
      const { tom, eileen, game } = setupGame({
        tom: { initialHand: unplayedSet("r10,r11,r12") }
      });

      tom.playFromHand([...tom.Hand].filter(RegularTile.Match));

      tom.endTurn();

      expect(game.CurrentPlayer).toBe(eileen);
    });

    it("more tiles can be played after a meld", () => {
      const { tom, eileen, hannah, game } = setupGame({
        tom: { initialHand: unplayedSet("r10,r11,r12,r1,r2,r3") }
      });

      const [r10, r11, r12, ...six] = tom.Hand.Items.filter(RegularTile.Match);

      tom.playFromHand([r10, r11, r12]);

      tom.endTurn();

      expect(game.CurrentPlayer).toBe(eileen);

      eileen.draw();
      hannah.draw();

      tom.playFromHand(six);

      tom.endTurn();

      expect(game.CurrentPlayer).toBe(eileen);
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
