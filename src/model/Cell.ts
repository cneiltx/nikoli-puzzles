import Corner from './Corner';
import VEdge from './VEdge';
import HEdge from "./HEdge";
import IEdgeCount from './IEdgeCount';

class Cell implements IEdgeCount {
  row: number;
  col: number;
  value: string;
  topEdge: VEdge;
  bottomEdge: VEdge;
  leftEdge: HEdge;
  rightEdge: HEdge;
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
    this.topEdge = tempVEdge;
    this.bottomEdge = tempVEdge;
    this.leftEdge = tempHEdge;
    this.rightEdge = tempHEdge;
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

  get isCornerCell() {
    return (this.leftCell === null || this.rightCell === null) && (this.topCell === null || this.bottomCell === null);
  }

  get outerHEdge() {
    if (this.leftCell === null) {
      return this.leftEdge;
    } else if (this.rightCell === null) {
      return this.rightEdge;
    } else {
      return null;
    }
  }

  get outerVEdge() {
    if (this.topCell === null) {
      return this.topEdge;
    } else if (this.bottomCell === null) {
      return this.bottomEdge;
    } else {
      return null;
    }
  }

  get innerHCell(): Cell | null {
    if (this.leftCell === null) {
      return this.rightCell;
    } else if (this.rightCell === null) {
      return this.leftCell;
    } else {
      return null;
    }
  }

  get innerVCell(): Cell | null {
    if (this.topCell === null) {
      return this.bottomCell;
    } else if (this.bottomCell === null) {
      return this.topCell;
    } else {
      return null;
    }
  }

  get edges(): (HEdge | VEdge)[] {
    return [this.topEdge, this.bottomEdge, this.leftEdge, this.rightEdge];
  }

  get edgeCount(): number {
    return this.edges.filter(edge => edge.value === "-").length;
  }

  get isSatisfied(): boolean {
    return this.value === "" || this.edgeCount === +this.value;
  }
}

export default Cell;