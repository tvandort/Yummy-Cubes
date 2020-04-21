export const JOKER = "JOKER";
export type Joker = "JOKER";
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
type Color = "RED" | "BLACK" | "BLUE" | "ORANGE";
type ShortColor = "r" | "b" | "u" | "o";
type TileFace = Face | Joker;
type TileColor = Color | Joker;
export type Tile = RegularTile | JokerTile;

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

interface Id {
  Id: string;
}

class JokerTile implements Id {
  get Face(): Joker {
    return JOKER;
  }

  get Color(): Joker {
    return JOKER;
  }

  get Id(): string {
    return "joker";
  }

  get IsJoker(): Boolean {
    return true;
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
}

class PlayedJokerTile extends JokerTile {
  private playedFace: Face;
  private playedColor: Color;

  constructor({ face, color }: { face: Face; color: Color }) {
    super();

    this.playedFace = face;
    this.playedColor = color;
  }

  get PlayedFace(): Face {
    return this.playedFace;
  }

  get PlayedColor(): Color {
    return this.playedColor;
  }
}

function toHash<T extends Id>(items: T[]) {
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
    const checkTilesHash = toHash(checkTiles);
    const tilesHash = toHash(this.items);

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

  get Count() {
    return this.items.length;
  }

  public [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
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

const sequenceExpression = /^joker$|^([rbou](13|12|11|10|[0-9]))$/;
export const generateSequence = (sequence: string) => {
  const tiles: (RegularTile | JokerTile)[] = [];
  const identifiers = sequence.split(",");
  for (let identifier of identifiers) {
    if (sequenceExpression.test(identifier) === false) {
      throw new Error("Sequence has invalid identifiers.");
    }

    if (identifier.toUpperCase() === JOKER) {
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
