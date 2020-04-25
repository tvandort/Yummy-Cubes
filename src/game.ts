import { UnplayedTile, Collection, PlayedTile, toCounts } from "./tile";
import { Bag } from "./bag";
import { IPlayer, Player } from "./player";
import { Set, PersistedSet } from "./set";
import { v4 } from "uuid";

interface IGamePlayer extends IPlayer {
  Hand: Collection<UnplayedTile>;
}

type ToSet = {
  to: PersistedSet | Set;
};

type BetweenSets = {
  to: PersistedSet | Set;
  from: PersistedSet;
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
      if (PersistedSet.IsSet(movement.to)) {
        this.game.meld({
          type: "SWAP_TILES_IN_SETS",
          a: movement.to,
          b: movement.from,
          player: this
        });
      } else {
      }
    } else {
      if (PersistedSet.IsSet(movement.to)) {
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

  removeFromHand(tiles: PlayedTile[]) {
    this.hand.remove(tiles);
  }

  giveUp() {
    this.hand.push(this.game.giveUp(this));
  }
}

// TODO AddToSet
// REMOVE TILES PROP RELY ON DIFFING OLD SET AND NEW SET.
// NEW SET - OLD SET RESULT SHOULD HAVE TILES THAT ARE IN HAND.
// OLD SET - NEW SET RESULT SHOULD BE EMPTY BECAUSE NEW SET SHOULD CONTAIN ALL
// OLD SET.
// REMOVE TILES FROM HAND.
// REPLACE SET. DONE.

// TODO SetToSet
// Check that the counts between both sets are equal.
// Replace sets at each index.
interface AddFromHand {
  type: "ADD";
  set: Set;
}

interface AddToSet {
  type: "ADD_TO_SET";
  set: PersistedSet;
}

interface SwapInSets {
  type: "SWAP_TILES_IN_SETS";
  a: PersistedSet;
  b: PersistedSet;
}

interface MoveToNewSet {
  type: "MOVE_TO_NEW_SET";
  from: PersistedSet;
  to: Set;
}

interface DrewCard {
  type: "DREW";
}

interface GiveUp {
  type: "GIVE_UP";
}

interface PlayerMessage {
  player: GamePlayer;
}

function isAddMessage(
  message: PlayerActions
): message is AddFromHand & PlayerMessage {
  return message.type === "ADD";
}

function isDrewMessage(
  message: PlayerActions
): message is DrewCard & PlayerMessage {
  return message.type === "DREW";
}

type PlayerActions = PlayerMessage &
  (AddFromHand | DrewCard | AddToSet | SwapInSets | MoveToNewSet | GiveUp);

export class Board {
  private sets: PersistedSet[];
  private history: PersistedSet[][];

  constructor(sets?: PersistedSet[]) {
    this.sets = sets ?? [];
    this.history = [];
  }

  get Count() {
    return this.sets.length;
  }

  valid() {
    return this.sets.every((set) => set.isValid());
  }

  push(set: Set) {
    this.history.push(this.sets);
    this.sets = [...this.sets, new PersistedSet(set.Items, v4())];
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

  private indexOf(set: PersistedSet) {
    for (let index = 0; index < this.sets.length; index++) {
      if (set.Id === this.sets[index].Id) {
        return index;
      }
    }
  }

  replace(replacement: PersistedSet) {
    this.history.push(this.sets);

    if (this.sets.map((set) => set.Id).includes(replacement.Id) === false) {
      throw new Error("That set doesn't exist.");
    }

    this.sets = this.sets.map((set) => {
      if (set.Id === replacement.Id) {
        return replacement;
      } else {
        return set;
      }
    });
  }

  reset() {
    if (this.history.length > 0) {
      this.sets = this.history[0];
      this.history = [];
    }
  }
}

export class Game {
  private playerIndex: number;
  private players: GamePlayer[];
  private playersById: { [key: string]: GamePlayer | undefined };
  private bag: Bag;
  private board: Board;
  private currentPlayerActions: PlayerActions[];
  private meldTracker: { [key: string]: boolean };
  private tilesPlayedByPlayer: PlayedTile[];
  private gameOver: boolean;

  constructor({ players, bag }: { players: Player[]; bag?: Bag }) {
    this.bag = bag ?? new Bag();
    this.playerIndex = 0;
    this.board = new Board();
    this.currentPlayerActions = [];
    this.tilesPlayedByPlayer = [];
    this.gameOver = false;

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

  get Board() {
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

  meld(message: PlayerActions) {
    const { player } = message;
    this.turnCheck(player);

    switch (message.type) {
      case "ADD": {
        const { set } = message;
        if (player.Hand.contains(set.Items) === false) {
          throw new Error(
            `${player.Name} tried to play tiles that they don't have in their hand.`
          );
        }
        player.removeFromHand(set.Items);
        this.tilesPlayedByPlayer.push(...set.Items);
        this.board.push(set);
        break;
      }

      case "ADD_TO_SET": {
        const { set } = message;
        const originalSet = this.board.find(set.Id);
        const tilesPlayedFromHand = set.without(originalSet.Items);
        if (player.Hand.contains(tilesPlayedFromHand) === false) {
          throw new Error(
            `${player.Name} tried to play tiles that they don't have in their hand.`
          );
        }
        if (originalSet.without(set.Items).length > 0) {
          throw new Error(
            `${player.Name} tried to play a set that is missing expected tiles.`
          );
        }

        player.removeFromHand(tilesPlayedFromHand);
        this.tilesPlayedByPlayer.push(...tilesPlayedFromHand);
        this.board.replace(set);
        break;
      }

      case "SWAP_TILES_IN_SETS": {
        const { a, b } = message;
        const oldA = this.board.find(a.Id);
        const oldB = this.board.find(b.Id);

        const newUnion = toCounts([...a.Items, ...b.Items]);
        const oldUnion = toCounts([...oldA.Items, ...oldB.Items]);

        const equalKeys =
          JSON.stringify(Object.keys(newUnion).sort()) ===
          JSON.stringify(Object.keys(oldUnion).sort());

        if (equalKeys === false) {
          throw new Error("Sets didn't contain tiles expected.");
        }

        for (let key of Object.keys(newUnion)) {
          const newValue = newUnion[key];
          const oldValue = oldUnion[key];

          if (newValue !== oldValue) {
            throw new Error("Sets didn't have the same tile counts");
          }
        }

        this.board.replace(a);
        this.board.replace(b);

        break;
      }

      case "MOVE_TO_NEW_SET": {
        const { from, to } = message;
        const oldSet = this.board.find(from.Id);

        const newSetCount = toCounts([...from.Items, ...to.Items]);
        const oldSetCount = toCounts(oldSet.Items);

        const equalKeys =
          JSON.stringify(Object.keys(newSetCount).sort()) ===
          JSON.stringify(Object.keys);

        if (equalKeys === false) {
          throw new Error("Sets didn't contain tiles expected.");
        }

        for (let key of Object.keys(newSetCount)) {
          const newValue = newSetCount[key];
          const oldValue = oldSetCount[key];

          if (newValue !== oldValue) {
            throw new Error("Sets didn't have the same tile counts");
          }
        }

        this.board.replace(from);
        this.board.push(to);

        break;
      }

      default: {
        throw new Error("Undefined action!");
      }
    }

    this.currentPlayerActions.push(message);
  }

  endTurn(player: GamePlayer) {
    this.turnCheck(player);

    if (
      this.meldTracker[player.Id] === false &&
      this.currentPlayerActions.filter((message) => isAddMessage(message))
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
    this.tilesPlayedByPlayer = [];

    this.gameOver = this.players.some((player) => player.Hand.Count === 0);
  }

  giveUp(player: GamePlayer) {
    this.turnCheck(player);

    if (
      this.currentPlayerActions.filter(({ type }) => type !== "DREW").length < 1
    ) {
      throw new Error(
        `${player.Name} cannot give up until they've moved tiles.`
      );
    }

    const returnTiles = this.tilesPlayedByPlayer;
    const penaltyTiles = [this.bag.draw(), this.bag.draw(), this.bag.draw()];

    this.currentPlayerActions.push({ type: "GIVE_UP", player });

    this.board.reset();

    this.endTurn(player);

    return [...returnTiles, ...penaltyTiles];
  }

  get Over() {
    return this.gameOver;
  }

  private turnCheck(player: GamePlayer) {
    if (this.Over) {
      throw new Error("Game is over!");
    }
    if (player != this.CurrentPlayer) {
      throw Error(`Not ${player.Name}'s turn!`);
    }
  }
}
