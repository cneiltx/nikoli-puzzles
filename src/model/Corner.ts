import Cell from './Cell';
import VEdge from './VEdge';
import HEdge from './HEdge';
import IEdgeCount from './IEdgeCount';

class Corner implements IEdgeCount {
  row: number;
  col: number;
  value: string;
  topEdge: HEdge | null = null;
  bottomEdge: HEdge | null = null;
  leftEdge: VEdge | null = null;
  rightEdge: VEdge | null = null;
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

  private get edges() {
    return [this.leftEdge, this.topEdge, this.rightEdge, this.bottomEdge].filter((edge): edge is (HEdge | VEdge) => {
      return edge !== null;
    });
  }

  private get nullEdgeCount() {
    let nullCount = 0;
    if (!this.leftEdge) nullCount++;
    if (!this.topEdge) nullCount++;
    if (!this.rightEdge) nullCount++;
    if (!this.bottomEdge) nullCount++;
    return nullCount;
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

  get isCornerCorner() {
    return this.nullEdgeCount === 2;
  }

  get isEdgeCorner() {
    return this.nullEdgeCount === 1;
  }

  get isInnerCorner() {
    return this.nullEdgeCount === 0;
  }

  get includedEdges() {
    return this.edges.filter(edge => edge.value === '-');
  }

  get excludedEdges() {
    return this.edges.filter(edge => edge.value === 'x');
  }

  get nonIncludedEdges() {
    return this.edges.filter(edge => edge.value !== '-');
  }

  get nonExcludedEdges() {
    return this.edges.filter(edge => edge.value !== 'x');
  }
}

export default Corner;