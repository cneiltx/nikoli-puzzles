import { Corner } from './Corner';
import { Cell } from './Cell';
import { HEdge } from './HEdge';
import { IValueChanged } from './IValueChanged';

export class VEdge {
  row: number;
  col: number;
  topCell: Cell | null = null;
  bottomCell: Cell | null = null;
  leftCorner: Corner;
  rightCorner: Corner;

  private privateValue: string;
  onValueChanged: IValueChanged = () => { };

  constructor(row: number, col: number, value: string) {
    const tempCorner = new Corner(-1, -1, 'temp');
    this.row = row;
    this.col = col;
    this.privateValue = value;
    this.leftCorner = tempCorner;
    this.rightCorner = tempCorner;
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

  get leftEdge() {
    return this.leftCorner.leftEdge;
  }

  get rightEdge() {
    return this.rightCorner.rightEdge;
  }

  get topLeftEdge() {
    return this.leftCorner.topEdge;
  }

  get topRightEdge() {
    return this.rightCorner.topEdge;
  }

  get bottomLeftEdge() {
    return this.leftCorner.bottomEdge;
  }

  get bottomRightEdge() {
    return this.rightCorner.bottomEdge;
  }

  get leftPath(): VEdge | HEdge | null {
    if (this.topLeftEdge?.value === '-') {
      return this.topLeftEdge;
    } else if (this.leftEdge?.value === '-') {
      return this.leftEdge;
    } else if (this.bottomLeftEdge?.value === '-') {
      return this.bottomLeftEdge;
    } else {
      return null;
    }
  }

  get rightPath(): VEdge | HEdge | null {
    if (this.topRightEdge?.value === '-') {
      return this.topRightEdge;
    } else if (this.rightEdge?.value === '-') {
      return this.rightEdge;
    } else if (this.bottomRightEdge?.value === '-') {
      return this.bottomRightEdge;
    } else {
      return null;
    }
  }
}