import { Corner } from './Corner';
import { Cell } from './Cell';
import { VEdge } from './VEdge';

export class HEdge {
  row: number;
  col: number;
  value: string;
  topCorner: Corner;
  bottomCorner: Corner;
  leftCell: Cell | null = null;
  rightCell: Cell | null = null;

  constructor(row: number, col: number, value: string) {
    const tempCorner = new Corner(-1, -1, 'temp');

    this.row = row;
    this.col = col;
    this.value = value;
    this.topCorner = tempCorner;
    this.bottomCorner = tempCorner;
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