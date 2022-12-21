import Cell from "./Cell";
import HEdge from "./HEdge";
import VEdge from "./VEdge";

class Corner {
  row: number;
  col: number;
  value: string;
  topEdge: VEdge | null = null;
  bottomEdge: VEdge | null = null;
  leftEdge: HEdge | null = null;
  rightEdge: HEdge | null = null;
  topLeftCell: Cell | null = null;
  topRightCell: Cell | null = null;
  bottomLeftCell: Cell | null = null;
  bottomRightCell: Cell | null = null;

  constructor(row: number, col: number, value: string) {
    this.row = row;
    this.col = col;
    this.value = value;
  }

  get topCorner() {
    return this.topEdge?.topCorner;
  }

  get bottomCorner() {
    return this.bottomEdge?.bottomCorner;
  }

  get leftCorner() {
    return this.leftEdge?.leftCorner;
  }

  get rightCorner() {
    return this.rightEdge?.rightCorner;
  }

  edgeCount() {
    let edgeCount = 0;
    if (this.topEdge?.value === "-") edgeCount++;
    if (this.bottomEdge?.value === "-") edgeCount++;
    if (this.leftEdge?.value === "-") edgeCount++;
    if (this.rightEdge?.value === "-") edgeCount++;
    return edgeCount;
  }

  isValid() {
    return this.edgeCount() === 0 || this.edgeCount() === 2;
  }
}

export default Corner;