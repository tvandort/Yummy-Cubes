import { Tile, generateTiles } from "./tile";

class Bag {
  private tiles: Tile[];
  constructor() {
    this.tiles = shuffle(generateTiles());
  }

  pick() {
    return this.tiles.shift();
  }

  drawHand() {
    const hand: Tile[] = [];
    for (let index = 0; index < 14; index++) {
      hand.push(this.pick());
    }

    return hand;
  }

  get Count() {
    return this.tiles.length;
  }
}

interface IPlayer {
  Name: string;
}

export class Player implements IPlayer {
  private name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  get Name() {
    return this.name;
  }
}

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

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

function shuffle<T>(items: T[]) {
  for (let index = 0; index < items.length; index++) {
    const swap = getRandomInt(items.length);
    const indexItem = items[index];
    const swapItem = items[swap];
    items[index] = swapItem;
    items[swap] = indexItem;
  }

  return items;
}

export class Game {
  private players: Player[];
  private playerIndex: number;
  private gamePlayers: GamePlayer[];
  private bag: Bag;

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;
    this.players = shuffle(players);
    this.gamePlayers = this.players.map(
      (player) => new GamePlayer({ player, bag: this.Bag })
    );
  }

  get PlayerOrder() {
    return Array.from(this.players);
  }

  get CurrentPlayer() {
    return this.gamePlayers[this.playerIndex];
  }

  private get Bag() {
    return this.bag;
  }
}
