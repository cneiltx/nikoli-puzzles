import Corner from "./Corner";
import Cell from "./Cell";
import HEdge from "./HEdge";

class VEdge {
  row: number;
  col: number;
  value: string;
  topCorner: Corner | null = null;
  bottomCorner: Corner | null = null;
  leftCell: Cell | null = null;
  rightCell: Cell | null = null;

  constructor(row: number, col: number, value: string) {
    this.row = row;
    this.col = col;
    this.value = value;
  }

  get topEdge() {
    return this.topCorner?.topEdge;
  }

  get bottomEdge() {
    return this.bottomCorner?.bottomEdge;
  }

  get topLeftEdge() {
    return this.topCorner?.leftEdge;
  }

  get topRightEdge() {
    return this.topCorner?.rightEdge;
  }

  get bottomLeftEdge() {
    return this.bottomCorner?.leftEdge;
  }

  get bottomRightEdge() {
    return this.bottomCorner?.rightEdge;
  }

  get topPath(): HEdge | VEdge | null {
    let pathCount = 0;
    let path = null;
    if (this.topLeftEdge?.value === "-") {
      pathCount++;
      path = this.topLeftEdge;
    }
    if (this.topEdge?.value === "-") {
      pathCount++;
      path = this.topEdge;
    }
    if (this.topRightEdge?.value === "-") {
      pathCount++;
      path = this.topRightEdge;
    }
    if (pathCount !== 1) return null;
    return path;
  }

  get bottomPath(): HEdge | VEdge | null {
    let pathCount = 0;
    let path = null;
    if (this.bottomLeftEdge?.value === "-") {
      pathCount++;
      path = this.bottomLeftEdge;
    }
    if (this.bottomEdge?.value === "-") {
      pathCount++;
      path = this.bottomEdge;
    }
    if (this.bottomRightEdge?.value === "-") {
      pathCount++;
      path = this.bottomRightEdge;
    }
    if (pathCount !== 1) return null;
    return path;
  }
}

export default VEdge;