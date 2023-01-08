import HEdge from "./HEdge";
import VEdge from "./VEdge";

class EdgeValueConflictError extends Error {
  edge: HEdge | VEdge;

  constructor(edge: HEdge | VEdge) {
    super();
    this.edge = edge;
  }
}

export default EdgeValueConflictError;