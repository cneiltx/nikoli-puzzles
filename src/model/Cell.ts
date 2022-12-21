import Corner from './Corner';
import HEdge from './HEdge';
import VEdge from "./VEdge";

class Cell {
  row: number;
  col: number;
  value: string;
  topEdge: HEdge | null = null;
  bottomEdge: HEdge | null = null;
  leftEdge: VEdge | null = null;
  rightEdge: VEdge | null = null;
  topLeftCorner: Corner | null = null;
  topRightCorner: Corner | null = null;
  bottomLeftCorner: Corner | null = null;
  bottomRightCorner: Corner | null = null;

  constructor(row: number, col: number, value: string) {
    this.row = row;
    this.col = col;
    this.value = value;
  }

  get topCell() {
    return this.topEdge?.topCell;
  }

  get bottomCell() {
    return this.bottomEdge?.bottomCell;
  }

  get leftCell() {
    return this.leftEdge?.leftCell;
  }

  get rightCell() {
    return this.rightEdge?.rightCell;
  }

  get topLeftCell() {
    return this.topLeftCorner?.topLeftCell;
  }

  get topRightCell() {
    return this.topRightCorner?.topRightCell;
  }

  get bottomLeftCell() {
    return this.bottomLeftCorner?.bottomLeftCell;
  }

  get bottomRightCell() {
    return this.bottomRightCorner?.bottomRightCell;
  }

  edgeCount() {
    let edgeCount = 0;
    if (this.topEdge?.value === "-") edgeCount++;
    if (this.bottomEdge?.value === "-") edgeCount++;
    if (this.leftEdge?.value === "-") edgeCount++;
    if (this.rightEdge?.value === "-") edgeCount++;
    return edgeCount;
  }

  isSatisfied() {
    return this.value === "" || this.edgeCount() === +this.value;
  }
}

export default Cell;