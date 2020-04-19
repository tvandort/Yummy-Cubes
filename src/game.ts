import { Tile } from "./tile";
import { Bag } from "./Bag";
import { IPlayer, Player } from "./player";

interface IGamePlayer extends IPlayer {
  Hand: Tile[];
}

class GamePlayer implements IGamePlayer {
  private player: Player;
  private hand: Tile[];
  private bag: Bag;

  constructor({ player, bag }: { player: Player; bag: Bag }) {
    this.player = player;
    this.bag = bag;
    this.hand = bag.drawHand();
  }

  get Name() {
    return this.player.Name;
  }

  get Hand() {
    return this.hand;
  }
}

export class Game {
  private playerIndex: number;
  private gamePlayers: GamePlayer[];
  private bag: Bag;

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;
    this.gamePlayers = players.map(
      (player) => new GamePlayer({ player, bag: this.Bag })
    );
  }

  get PlayerOrder() {
    return Array.from(this.gamePlayers);
  }

  get CurrentPlayer() {
    return this.gamePlayers[this.playerIndex];
  }

  private get Bag() {
    return this.bag;
  }
}
