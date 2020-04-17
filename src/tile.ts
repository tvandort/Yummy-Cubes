type JOKER = "JOKER";

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
  | "13"
  | JOKER;

type Color = "RED" | "BLACK" | "BLUE" | "ORANGE" | JOKER;

export default class Tile {
  private _face: Face;
  private _color: Color;

  constructor({ face, color }: { face: Face; color: Color }) {
    this._face = face;
    this._color = color;
  }

  get face(): Face {
    return this._face;
  }

  get color(): Color {
    return this._color;
  }
}

const buildDeck = () => {};

export { buildDeck };
