import Cell from "./Cell";

class CellValueConflictError extends Error {
  cell: Cell;

  constructor(cell: Cell) {
    super();
    this.cell = cell;
  }
}

export default CellValueConflictError;