import { Tile } from "./tile";
import { Bag } from "./bag";
import { IPlayer, Player } from "./player";

interface IGamePlayer extends IPlayer {
  Hand: Tile[];
  Id: string;
}

class GamePlayer implements IGamePlayer {
  private player: Player;
  private hand: Tile[];
  private game: Game;

  constructor({ player, game }: { player: Player; game: Game }) {
    this.player = player;
    this.game = game;
    this.hand = player.InitialHand ?? this.game.drawHand();
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
    this.hand.push(this.game.draw());
  }
}

export class Game {
  private playerIndex: number;
  private players: GamePlayer[];
  private playersById: { [key: string]: GamePlayer | undefined };
  private bag: Bag;

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;

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

  private get Bag() {
    return this.bag;
  }

  drawHand() {
    return this.bag.drawHand();
  }

  getPlayer(id: string) {
    return this.playersById[id];
  }

  draw() {
    const tile = this.bag.draw();

    this.playerIndex = (this.playerIndex + 1) % this.players.length;

    return tile;
  }
}
