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

const SHORT_COLOR_TO_COLOR: { [key: string]: Color } = {
  r: "RED",
  b: "BLACK",
  u: "BLUE",
  o: "ORANGE"
};
type TileColor = Color | JOKER;

export class Tile {
  private _face: TileFace;
  private _color: TileColor;

  constructor({ face, color }: { face: TileFace; color: TileColor }) {
    this._face = face;
    this._color = color;
  }

  get face(): TileFace {
    return this._face;
  }

  get color(): TileColor {
    return this._color;
  }

  static JOKER = () => new Tile({ color: JOKER, face: JOKER });
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
