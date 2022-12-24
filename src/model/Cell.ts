import Corner from './Corner';
import HEdge from './HEdge';
import VEdge from "./VEdge";
import IEdgeCount from './IEdgeCount';

class Cell implements IEdgeCount {
  row: number;
  col: number;
  value: string;
  topEdge: HEdge;
  bottomEdge: HEdge;
  leftEdge: VEdge;
  rightEdge: VEdge;
  topLeftCorner: Corner;
  topRightCorner: Corner;
  bottomLeftCorner: Corner;
  bottomRightCorner: Corner;

  constructor(row: number, col: number, value: string) {
    const tempHEdge = new HEdge(-1, -1, "temp");
    const tempVEdge = new VEdge(-1, -1, "temp");
    const tempCorner = new Corner(-1, -1, "temp");

    this.row = row;
    this.col = col;
    this.value = value;
    this.topEdge = tempHEdge;
    this.bottomEdge = tempHEdge;
    this.leftEdge = tempVEdge;
    this.rightEdge = tempVEdge;
    this.topLeftCorner = tempCorner;
    this.topRightCorner = tempCorner;
    this.bottomLeftCorner = tempCorner;
    this.bottomRightCorner = tempCorner;
  }

  get topCell() {
    return this.topEdge.topCell;
  }

  get bottomCell() {
    return this.bottomEdge.bottomCell;
  }

  get leftCell() {
    return this.leftEdge.leftCell;
  }

  get rightCell() {
    return this.rightEdge.rightCell;
  }

  get topLeftCell() {
    return this.topLeftCorner.topLeftCell;
  }

  get topRightCell() {
    return this.topRightCorner.topRightCell;
  }

  get bottomLeftCell() {
    return this.bottomLeftCorner.bottomLeftCell;
  }

  get bottomRightCell() {
    return this.bottomRightCorner.bottomRightCell;
  }

  get topLeftEdgeCount() {
    return this.topLeftCorner.bottomRightEdgeCount;
  }

  get topRightEdgeCount() {
    return this.topRightCorner.bottomLeftEdgeCount;
  }

  get bottomLeftEdgeCount() {
    return this.bottomLeftCorner.topRightEdgeCount;
  }

  get bottomRightEdgeCount() {
    return this.bottomRightCorner.topLeftEdgeCount;
  }

  edgeCount() {
    let edgeCount = 0;
    if (this.topEdge.value === "-") edgeCount++;
    if (this.bottomEdge.value === "-") edgeCount++;
    if (this.leftEdge.value === "-") edgeCount++;
    if (this.rightEdge.value === "-") edgeCount++;
    return edgeCount;
  }

  isSatisfied() {
    return this.value === "" || this.edgeCount() === +this.value;
  }
}

export default Cell;