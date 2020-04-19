import { Tile, Tiles } from "./tile";
import { Bag } from "./bag";
import { IPlayer, Player } from "./player";

interface IGamePlayer extends IPlayer {
  Hand: Tiles;
  Id: string;
}

class GamePlayer implements IGamePlayer {
  private player: Player;
  private hand: Tiles;
  private game: Game;

  constructor({ player, game }: { player: Player; game: Game }) {
    this.player = player;
    this.game = game;

    if (player.InitialHand) {
      this.hand = new Tiles(player.InitialHand);
    } else {
      this.hand = new Tiles(this.game.drawHand());
    }
  }

  get Name() {
    return this.player.Name;
  }

  get Hand() {
    return this.hand;
  }

  get Id() {
    return this.player.Id;
  }

  draw() {
    this.hand.push(this.game.draw(this));
  }

  place(tiles: Tile[]) {
    this.game.place({ tiles, player: this });
  }
}

export class Game {
  private playerIndex: number;
  private players: GamePlayer[];
  private playersById: { [key: string]: GamePlayer | undefined };
  private bag: Bag;
  private sets: Tiles[];

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;
    this.sets = [];

    this.players = players.map((player) => {
      const gamePlayer = new GamePlayer({ player, game: this });
      return gamePlayer;
    });

    this.playersById = {};
    for (let player of this.players) {
      this.playersById[player.Id] = player;
    }
  }

  get PlayerOrder() {
    return Array.from(this.players);
  }

  get CurrentPlayer() {
    return this.players[this.playerIndex];
  }

  get Sets() {
    return this.sets;
  }

  drawHand() {
    return this.bag.drawHand();
  }

  getPlayer(id: string) {
    return this.playersById[id];
  }

  draw(player: GamePlayer) {
    this.turnCheck(player);

    const tile = this.bag.draw();

    this.playerIndex = (this.playerIndex + 1) % this.players.length;

    return tile;
  }

  place({ tiles, player }: { tiles: Tile[]; player: GamePlayer }) {
    this.turnCheck(player);

    if (player.Hand.contains(tiles) === false) {
      throw new Error(
        `${player.Name} tried to play tiles that they don't have in their hand.`
      );
    }

    this.sets.push(new Tiles(tiles));
  }

  private turnCheck(player: GamePlayer) {
    if (player != this.CurrentPlayer) {
      throw Error(`Not ${player.Name}'s turn!`);
    }
  }
}
