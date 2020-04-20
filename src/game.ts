import { Tile, Tiles } from "./tile";
import { Bag } from "./bag";
import { IPlayer, Player } from "./player";

interface IGamePlayer extends IPlayer {
  Hand: Tiles;
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

  playFromHand(tiles: Tile[]) {
    this.game.meld({
      type: "ADD",
      tiles,
      player: this
    });
  }
}

interface AddFromHand {
  type: "ADD";
  tiles: Tile[];
}

interface PlayerMessage {
  player: GamePlayer;
}

type MeldMessage = PlayerMessage & AddFromHand;

export class Set extends Tiles {
  valid() {
    return false;
  }
}

class Board {
  private sets: Set[];

  constructor() {
    this.sets = [];
  }

  get Count() {
    return this.sets.length;
  }

  valid() {
    return this.sets.every((set) => set.valid());
  }

  push(set: Set) {
    this.sets.push(set);
  }

  at(index: number) {
    return this.sets[index];
  }
}

export class Game {
  private playerIndex: number;
  private players: GamePlayer[];
  private playersById: { [key: string]: GamePlayer | undefined };
  private bag: Bag;
  private board: Board;
  private currentPlayerActions: PlayerMessage[];

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;
    this.board = new Board();
    this.currentPlayerActions = [];

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
    return this.board;
  }

  drawHand() {
    return this.bag.drawHand();
  }

  getPlayer(id: string) {
    return this.playersById[id];
  }

  draw(player: GamePlayer) {
    this.turnCheck(player);

    // Check that board is valid? Check all sets.
    if (this.currentPlayerActions.length > 0) {
      throw new Error(
        "Tom cannot draw because they have placed tiles on the board!"
      );
    }

    const tile = this.bag.draw();

    this.endTurn(player);

    return tile;
  }

  meld(message: MeldMessage) {
    const { player, type } = message;
    this.turnCheck(player);
    this.currentPlayerActions.push(message);

    if (type === "ADD") {
      const { tiles } = message;
      if (player.Hand.contains(tiles) === false) {
        throw new Error(
          `${player.Name} tried to play tiles that they don't have in their hand.`
        );
      }

      this.board.push(new Set(tiles));
    }
  }

  endTurn(player: GamePlayer) {
    this.turnCheck(player);
    this.playerIndex = (this.playerIndex + 1) % this.players.length;
  }

  private turnCheck(player: GamePlayer) {
    if (player != this.CurrentPlayer) {
      throw Error(`Not ${player.Name}'s turn!`);
    }
  }
}
