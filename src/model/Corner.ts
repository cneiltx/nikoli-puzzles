import Cell from "./Cell";
import HEdge from "./HEdge";
import VEdge from "./VEdge";
import IEdgeCount from "./IEdgeCount";

class Corner implements IEdgeCount {
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
  topLeftEdgeCount: Set<number> = new Set<number>([0, 1, 2]);
  topRightEdgeCount: Set<number> = new Set<number>([0, 1, 2]);
  bottomLeftEdgeCount: Set<number> = new Set<number>([0, 1, 2]);
  bottomRightEdgeCount: Set<number> = new Set<number>([0, 1, 2]);

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
}

export default Corner;