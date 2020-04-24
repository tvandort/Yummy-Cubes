import { Id } from "./id";

type Color = "RED" | "BLACK" | "BLUE" | "ORANGE";
type Face =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13";

const JOKER = "JOKER";
type Joker = "JOKER";

type TileFace = Face | Joker;
type TileColor = Color | Joker;

type ShortColor = "r" | "b" | "u" | "o";

export type UnplayedTile = RegularTile | JokerTile;
export type PlayedTile = RegularTile | PlayedJokerTile;

export const colors: Color[] = ["RED", "BLACK", "BLUE", "ORANGE"];
export const faces: Face[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13"
];

const SHORT_COLOR_TO_COLOR: { [key: string]: Color } = {
  r: "RED",
  b: "BLACK",
  u: "BLUE",
  o: "ORANGE"
};

const COLOR_TO_SHORT_COLOR: { [key: string]: ShortColor } = {
  RED: "r",
  BLACK: "b",
  BLUE: "u",
  ORANGE: "o"
};

export class JokerTile implements Id {
  get Id(): string {
    return "joker";
  }

  get IsJoker(): Boolean {
    return true;
  }

  static Match(tile: RegularTile | JokerTile): tile is JokerTile {
    return tile.IsJoker === true;
  }
}

export class TileFactory {
  static create({ face, color }: { face: TileFace; color: TileColor }) {
    if (face === JOKER && color === JOKER) {
      return new JokerTile();
    }

    if (face !== JOKER && color !== JOKER) {
      return new RegularTile({ face, color });
    }

    throw new Error("Some unknown tile.");
  }

  static Joker() {
    return new JokerTile();
  }
}

export class RegularTile {
  private face: Face;
  private color: Color;
  private id: string;

  constructor({ face, color }: { face: Face; color: Color }) {
    this.face = face;
    this.color = color;

    this.id = `${COLOR_TO_SHORT_COLOR[color]}${face}`;
  }

  get Face(): Face {
    return this.face;
  }

  get Color(): Color {
    return this.color;
  }

  get Id(): string {
    return this.id;
  }

  get IsJoker(): Boolean {
    return false;
  }

  static Match(tile: RegularTile | JokerTile): tile is RegularTile {
    return tile.IsJoker === false;
  }

  get Value(): number {
    return parseInt(this.face);
  }
}

export class PlayedJokerTile extends JokerTile {
  private face: Face;
  private color: Color;

  constructor({ face, color }: { face: Face; color: Color }) {
    super();

    this.face = face;
    this.color = color;
  }

  get Face(): Face {
    return this.face;
  }

  get Color(): Color {
    return this.color;
  }

  get Value() {
    return parseInt(this.face);
  }
}

function toCounts<T extends Id>(items: T[]) {
  const hash: { [key: string]: number } = {};
  for (let item of items) {
    let count = hash[item.Id];

    hash[item.Id] = (count ?? 0) + 1;
  }

  return hash;
}

export class Collection<T extends Id> {
  private items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  push(item: T) {
    this.items.push(item);
  }

  at(identifier: number | string) {
    if (typeof identifier === "number") {
      return this.items[identifier];
    } else {
      return this.items.filter((item) => item.Id === identifier)[0];
    }
  }

  contains(checkTiles: T[]) {
    const checkTilesHash = toCounts(checkTiles);
    const tilesHash = toCounts(this.items);

    for (let key of Object.keys(checkTilesHash)) {
      const count = tilesHash[key];
      if (count && count >= checkTilesHash[key]) {
        tilesHash[key] = count - 1;
      } else {
        return false;
      }
    }

    return true;
  }

  without(items: T[]) {
    const without = items.map((item) => item);
    const copy = this.items.map((item) => item);

    let index = 0;
    while (without.length > 0) {
      const find = without.shift()!;
      while (copy.length > index) {
        if (copy[index].Id === find.Id) {
          copy.splice(index, 1);
          break;
        }
        index += 1;
      }

      index = 0;
    }

    return copy;
  }

  remove(items: T[]) {
    while (items.length > 0) {
      const removeItem = items.shift()!;

      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].Id === removeItem.Id) {
          this.items.splice(index, 1);
          break;
        }
      }
    }
  }

  get Count() {
    return this.items.length;
  }

  public [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }

  get Items() {
    return this.items.map((item) => item);
  }
}

export const generateTiles: () => (RegularTile | JokerTile)[] = () => {
  const tiles: (RegularTile | JokerTile)[] = [new JokerTile(), new JokerTile()];

  for (let color of colors) {
    for (let face of faces) {
      // Two of each tile.
      tiles.push(new RegularTile({ color, face }));
      tiles.push(new RegularTile({ color, face }));
    }
  }

  return tiles;
};

const unplayedExpression = /^j$|^([rbou](13|12|11|10|[0-9]))$/;
export const unplayedSet = (sequence: string) => {
  const tiles: (RegularTile | JokerTile)[] = [];
  const identifiers = sequence.split(",");
  for (let identifier of identifiers) {
    if (unplayedExpression.test(identifier) === false) {
      throw new Error("Sequence has invalid identifiers.");
    }

    if (identifier.toUpperCase() === "J") {
      tiles.push(new JokerTile());
    } else {
      let colorChar = identifier[0];
      let face = identifier.slice(1) as Face;
      let color = SHORT_COLOR_TO_COLOR[colorChar];
      tiles.push(new RegularTile({ color, face }));
    }
  }

  return tiles;
};

const playedExpression = /^j?[rbou](13|12|11|10|[0-9])$/;
export const playedSet = (sequence: string) => {
  const tiles: (PlayedJokerTile | RegularTile)[] = [];
  const identifiers = sequence.split(",");
  for (let identifier of identifiers) {
    if (playedExpression.test(identifier) === false) {
      throw new Error("Sequence has invalid identifiers.");
    }

    const isJoker = identifier.startsWith("j");

    const jokerOffset = isJoker ? 1 : 0;
    let colorChar = identifier[0 + jokerOffset];
    let face = identifier.slice(1 + jokerOffset) as Face;
    let color = SHORT_COLOR_TO_COLOR[colorChar];

    if (isJoker) {
      tiles.push(new PlayedJokerTile({ color, face }));
    } else {
      tiles.push(new RegularTile({ color, face }));
    }
  }

  return tiles;
};
