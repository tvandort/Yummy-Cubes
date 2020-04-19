import { Game, Player } from "../src/game";

describe(Game, () => {
  it("has a random player order", () => {
    const { tom, eileen, hannah, players } = setupPlayers();
    const games: Game[] = [];

    for (let index = 0; index < 10; index++) {
      games.push(new Game({ players }));
    }

    const orders = games.map((game) => game.PlayerOrder);

    expect(
      orders.every(
        (order) => order[0] == tom && order[1] == eileen && order[2] == hannah
      )
    ).toBe(false);
  });

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
