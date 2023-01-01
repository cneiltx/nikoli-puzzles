import Corner from './Corner';
import Cell from './Cell';
import VEdge from './VEdge';

class HEdge {
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
    let pathCount = 0;
    let path = null;
    if (this.topLeftEdge?.value === '-') {
      pathCount++;
      path = this.topLeftEdge;
    }
    if (this.topEdge?.value === '-') {
      pathCount++;
      path = this.topEdge;
    }
    if (this.topRightEdge?.value === '-') {
      pathCount++;
      path = this.topRightEdge;
    }
    if (pathCount !== 1) return null;
    return path;
  }

  get bottomPath(): VEdge | HEdge | null {
    let pathCount = 0;
    let path = null;
    if (this.bottomLeftEdge?.value === '-') {
      pathCount++;
      path = this.bottomLeftEdge;
    }
    if (this.bottomEdge?.value === '-') {
      pathCount++;
      path = this.bottomEdge;
    }
    if (this.bottomRightEdge?.value === '-') {
      pathCount++;
      path = this.bottomRightEdge;
    }
    if (pathCount !== 1) return null;
    return path;
  }
}

export default HEdge;