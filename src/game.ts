import { UnplayedTile, Collection, PlayedTile } from "./tile";
import { Bag } from "./bag";
import { IPlayer, Player } from "./player";
import { NewSet, Set } from "./set";
import { v4 } from "uuid";

interface IGamePlayer extends IPlayer {
  Hand: Collection<UnplayedTile>;
}

type ToSet = {
  to: Set | NewSet;
};

type BetweenSets = {
  to: Set | NewSet;
  from: Set;
};

function isBetweenSets(movement: ToSet | BetweenSets): movement is BetweenSets {
  return Boolean((movement as BetweenSets).from);
}

class GamePlayer implements IGamePlayer {
  private player: Player;
  private hand: Collection<UnplayedTile>;
  private game: Game;

  constructor({ player, game }: { player: Player; game: Game }) {
    this.player = player;
    this.game = game;

    if (player.InitialHand) {
      this.hand = new Collection(player.InitialHand);
    } else {
      this.hand = new Collection(this.game.drawHand());
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

  play(movement: ToSet | BetweenSets) {
    if (isBetweenSets(movement)) {
    } else {
      if (Set.IsSet(movement.to)) {
        this.game.meld({
          type: "ADD_TO_SET",
          set: movement.to,
          player: this
        });
      } else {
        this.game.meld({
          type: "ADD",
          player: this,
          set: movement.to
        });
      }
    }
  }

  endTurn() {
    this.game.endTurn(this);
  }
}

// TODO AddFromHand
// Create new set check hand.

// TODO AddToSet
// REMOVE TILES PROP RELY ON DIFFING OLD SET AND NEW SET.
// NEW SET - OLD SET RESULT SHOULD HAVE TILES THAT ARE IN HAND.
// REMOVE TILES FROM HAND.
// REPLACE SET. DONE.

// TODO SetToSet
// Check that the counts between both sets are equal.
// Replace sets at each index.
interface AddFromHand {
  type: "ADD";
  set: NewSet;
}

interface AddToSet {
  type: "ADD_TO_SET";
  set: Set;
}

interface DrewCard {
  type: "DREW";
}

interface PlayerMessage {
  player: GamePlayer;
}

function isAddMessage(
  message: MeldMessage
): message is AddFromHand & PlayerMessage {
  return message.type === "ADD";
}

function isDrewMessage(
  message: MeldMessage
): message is DrewCard & PlayerMessage {
  return message.type === "DREW";
}

type MeldMessage = PlayerMessage & (AddFromHand | DrewCard | AddToSet);

class Board {
  private sets: Set[];

  constructor() {
    this.sets = [];
  }

  get Count() {
    return this.sets.length;
  }

  valid() {
    return this.sets.every((set) => set.isValid());
  }

  push(set: NewSet) {
    this.sets.push(new Set(set.Items, v4()));
  }

  at(index: number) {
    return this.sets[index];
  }

  find(id: string) {
    const results = this.sets.filter((set) => set.Id === id);
    if (results.length !== 1) {
      throw new Error(
        `Something weird happened, there are: ${results.length} sets that match ${id}? That shouldn't happen.`
      );
    }

    return results[0];
  }

  private indexOf(set: Set) {
    for (let index = 0; index < this.sets.length; index++) {
      if (set.Id === this.sets[index].Id) {
        return index;
      }
    }
  }

  replace(set: Set) {
    const index = this.indexOf(set);
    if (index !== undefined) {
      this.sets[index] = set;
    } else {
      throw new Error("That set doesn't exist.");
    }
  }
}

export class Game {
  private playerIndex: number;
  private players: GamePlayer[];
  private playersById: { [key: string]: GamePlayer | undefined };
  private bag: Bag;
  private board: Board;
  private currentPlayerActions: MeldMessage[];
  private meldTracker: { [key: string]: boolean };

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;
    this.board = new Board();
    this.currentPlayerActions = [];

    this.players = players.map((player) => {
      const gamePlayer = new GamePlayer({ player, game: this });
      return gamePlayer;
    });

    this.meldTracker = {};
    this.playersById = {};
    for (let player of this.players) {
      this.playersById[player.Id] = player;
      this.meldTracker[player.Id] = false;
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
    const drawMessage: DrewCard & PlayerMessage = { player, type: "DREW" };

    if (this.currentPlayerActions.length > 0) {
      throw new Error(
        `${player.Name} cannot draw because they have placed tiles on the board!`
      );
    }

    this.currentPlayerActions.push(drawMessage);
    const tile = this.bag.draw();

    this.endTurn(player);

    return tile;
  }

  meld(message: MeldMessage) {
    const { player } = message;
    this.turnCheck(player);
    this.currentPlayerActions.push(message);

    switch (message.type) {
      case "ADD": {
        const { set } = message;
        if (player.Hand.contains(set.Items) === false) {
          throw new Error(
            `${player.Name} tried to play tiles that they don't have in their hand.`
          );
        }
        this.board.push(set);
        break;
      }

      case "ADD_TO_SET": {
        const { set } = message;
        const originalSet = this.board.find(set.Id);
        if (player.Hand.contains(set.without(originalSet.Items)) === false) {
          throw new Error(
            `${player.Name} tried to play tiles that they don't have in their hand.`
          );
        }
        if (originalSet.without(set.Items).length > 0) {
          throw new Error(
            `${player.Name} tried to play a set that is missing expected tiles.`
          );
        }

        this.board.replace(set);

        break;
      }

      default: {
        throw new Error("Undefined action!");
      }
    }
  }

  endTurn(player: GamePlayer) {
    this.turnCheck(player);

    if (
      this.meldTracker[player.Id] === false &&
      this.currentPlayerActions.filter((message) => !isDrewMessage(message))
        .length > 0
    ) {
      const sum = this.currentPlayerActions
        .filter(isAddMessage)
        .flatMap((message) => message.set.Items)
        .reduce((sum, tile) => sum + tile.Value, 0);

      if (sum > 29) {
        this.meldTracker[player.Id] = true;
      } else {
        throw new Error(`${player.Name} hasn't melded yet.`);
      }
    }

    if (this.board.valid() === false) {
      throw new Error("Board is not in a valid state!");
    }

    if (this.currentPlayerActions.length < 1) {
      throw new Error(`${player.Name} has not melded this turn!`);
    }

    this.playerIndex = (this.playerIndex + 1) % this.players.length;
    this.currentPlayerActions = [];
  }

  private turnCheck(player: GamePlayer) {
    if (player != this.CurrentPlayer) {
      throw Error(`Not ${player.Name}'s turn!`);
    }
  }
}
