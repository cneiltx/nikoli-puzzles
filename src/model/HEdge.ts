import { Corner } from './Corner';
import { Cell } from './Cell';
import { VEdge } from './VEdge';

export class HEdge {
  row: number;
  col: number;
  topCorner: Corner;
  bottomCorner: Corner;
  leftCell: Cell | null = null;
  rightCell: Cell | null = null;

  // TODO: Figure out if we can use this or not
  private privateValue: string;
  private onValueChanged(value: string): void { };

  constructor(row: number, col: number, value: string, onValueChanged = (value: string) => { }) {
    const tempCorner = new Corner(-1, -1, 'temp');
    this.row = row;
    this.col = col;
    this.privateValue = value;
    this.onValueChanged = onValueChanged;
    this.topCorner = tempCorner;
    this.bottomCorner = tempCorner;
  }

  get value() {
    return this.privateValue;
  }

  set value(value: string) {
    if (this.privateValue !== value) {
      this.privateValue = value;
      this.onValueChanged(value);
    }
  }

  get topEdge() {
    return this.topCorner.topEdge;
  }

  get bottomEdge() {
    return this.bottomCorner.bottomEdge;
  }

  get topLeftEdge() {
    return this.topCorner.leftEdge;
  }

  get topRightEdge() {
    return this.topCorner.rightEdge;
  }

  get bottomLeftEdge() {
    return this.bottomCorner.leftEdge;
  }

  get bottomRightEdge() {
    return this.bottomCorner.rightEdge;
  }

  get topPath(): VEdge | HEdge | null {
    if (this.topLeftEdge?.value === '-') {
      return this.topLeftEdge;
    } else if (this.topEdge?.value === '-') {
      return this.topEdge;
    } else if (this.topRightEdge?.value === '-') {
      return this.topRightEdge;
    } else {
      return null;
    }
  }

  get bottomPath(): VEdge | HEdge | null {
    if (this.bottomLeftEdge?.value === '-') {
      return this.bottomLeftEdge;
    } else if (this.bottomEdge?.value === '-') {
      return this.bottomEdge;
    } else if (this.bottomRightEdge?.value === '-') {
      return this.bottomRightEdge;
    } else {
      return null;
    }
  }
}