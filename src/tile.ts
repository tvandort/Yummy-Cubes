export const JOKER = "JOKER";
export type JOKER = "JOKER";
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
type TileFace = Face | JOKER;
type Color = "RED" | "BLACK" | "BLUE" | "ORANGE";
type ShortColor = "r" | "b" | "u" | "o";
type TileColor = Color | JOKER;

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

export class Tile {
  private face: TileFace;
  private color: TileColor;
  private id: string;

  constructor({ face, color }: { face: TileFace; color: TileColor }) {
    this.face = face;
    this.color = color;
    if (face === JOKER) {
      this.id = JOKER;
    } else {
      this.id = `${COLOR_TO_SHORT_COLOR[color]}${face}`;
    }
  }

  get Face(): TileFace {
    return this.face;
  }

  get Color(): TileColor {
    return this.color;
  }

  get Id(): string {
    return this.id;
  }

  static JOKER = () => new Tile({ color: JOKER, face: JOKER });
}

export class Tiles {
  private tiles: Tile[];

  constructor(tiles: Tile[]) {
    this.tiles = tiles;
  }

  push(tile: Tile) {
    this.tiles.push(tile);
  }

  at(identifier: number | string) {
    if (typeof identifier === "number") {
      return this.tiles[identifier];
    } else {
      return this.tiles.filter((tile) => tile.Id === identifier)[0];
    }
  }

  contains(checkTiles: Tile[]) {
    const checkTilesHash = Tiles.toHash(checkTiles);
    const tilesHash = Tiles.toHash(this.tiles);

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
    return this.tiles.length;
  }

  private static toHash(tiles: Tile[]) {
    const hash: { [key: string]: number } = {};
    for (let tile of tiles) {
      let count = hash[tile.Id];

      hash[tile.Id] = (count ?? 0) + 1;
    }

    return hash;
  }
}

export const generateTiles: () => Tile[] = () => {
  const tiles = [
    new Tile({ color: JOKER, face: JOKER }),
    new Tile({ color: JOKER, face: JOKER })
  ];

  for (let color of colors) {
    for (let face of faces) {
      // Two of each tile.
      tiles.push(new Tile({ color, face }));
      tiles.push(new Tile({ color, face }));
    }
  }

  return tiles;
};

const sequenceExpression = /^joker$|^([rbou](13|12|11|10|[0-9]))$/;
export const generateSequence = (sequence: string) => {
  const tiles: Tile[] = [];
  const identifiers = sequence.split(",");
  for (let identifier of identifiers) {
    if (sequenceExpression.test(identifier) === false) {
      throw new Error("Sequence has invalid identifiers.");
    }

    if (identifier.toUpperCase() === JOKER) {
      tiles.push(Tile.JOKER());
    } else {
      let colorChar = identifier[0];
      let face = identifier.slice(1) as Face;
      let color = SHORT_COLOR_TO_COLOR[colorChar];
      tiles.push(new Tile({ color, face }));
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
