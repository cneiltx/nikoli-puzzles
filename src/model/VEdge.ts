import Corner from "./Corner";
import Cell from "./Cell";
import HEdge from "./HEdge";

class VEdge {
  row: number;
  col: number;
  value: string;
  topCell: Cell | null = null;
  bottomCell: Cell | null = null;
  leftCorner: Corner;
  rightCorner: Corner;

  constructor(row: number, col: number, value: string) {
    const tempCorner = new Corner(-1, -1, "temp");

    this.row = row;
    this.col = col;
    this.value = value;
    this.leftCorner = tempCorner;
    this.rightCorner = tempCorner;
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

  get rightPath(): VEdge | HEdge | null {
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

export default VEdge;