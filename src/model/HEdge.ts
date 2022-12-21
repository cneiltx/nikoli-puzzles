import Corner from "./Corner";
import Cell from "./Cell";
import VEdge from "./VEdge";

class HEdge {
  row: number;
  col: number;
  value: string;
  topCell: Cell | null = null;
  bottomCell: Cell | null = null;
  leftCorner: Corner | null = null;
  rightCorner: Corner | null = null;

  constructor(row: number, col: number, value: string) {
    this.row = row;
    this.col = col;
    this.value = value;
  }

  get leftEdge() {
    return this.leftCorner?.leftEdge;
  }

  get rightEdge() {
    return this.rightCorner?.rightEdge;
  }

  get topLeftEdge() {
    return this.leftCorner?.topEdge;
  }

  get topRightEdge() {
    return this.rightCorner?.topEdge;
  }

  get bottomLeftEdge() {
    return this.leftCorner?.bottomEdge;
  }

  get bottomRightEdge() {
    return this.rightCorner?.bottomEdge;
  }

  get leftPath(): HEdge | VEdge | null {
    let pathCount = 0;
    let path = null;
    if (this.topLeftEdge?.value === "-") {
      pathCount++;
      path = this.topLeftEdge;
    }
    if (this.leftEdge?.value === "-") {
      pathCount++;
      path = this.leftEdge;
    }
    if (this.bottomLeftEdge?.value === "-") {
      pathCount++;
      path = this.bottomLeftEdge;
    }
    if (pathCount !== 1) return null;
    return path;
  }

  get rightPath(): HEdge | VEdge | null {
    let pathCount = 0;
    let path = null;
    if (this.topRightEdge?.value === "-") {
      pathCount++;
      path = this.topRightEdge;
    }
    if (this.rightEdge?.value === "-") {
      pathCount++;
      path = this.rightEdge;
    }
    if (this.bottomRightEdge?.value === "-") {
      pathCount++;
      path = this.bottomRightEdge;
    }
    if (pathCount !== 1) return null;
    return path;
  }
}

export default HEdge;