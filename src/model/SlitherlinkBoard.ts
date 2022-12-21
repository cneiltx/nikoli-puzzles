import Cell from "./Cell";
import Corner from "./Corner";
import HEdge from "./HEdge";
import VEdge from "./VEdge";

class SlitherlinkBoard {
  rows: number;
  columns: number;
  cells: Cell[][];
  hEdges: HEdge[][];
  vEdges: VEdge[][];
  corners: Corner[][];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;

    const rawCellValues = [
      ["2", "2", "2", "3", "3", "1", ""],
      ["", "", "0", "2", "", "3", ""],
      ["", "", "", "", "", "", ""],
      ["3", "3", "", "", "3", "3", ""],
      ["", "", "2", "", "2", "", ""],
      ["3", "", "2", "", "2", "2", ""],
      ["3", "", "2", "", "", "3", ""]
    ];

    this.cells = rawCellValues.map((cellRow, rowIndex) => cellRow.map((cell, colIndex) => new Cell(rowIndex, colIndex, cell)));
    this.hEdges = Array(rows + 1).fill("").map((edgeRow, rowIndex) => Array(columns).fill("").map((edge, colIndex) => new HEdge(rowIndex, colIndex, "")));
    this.vEdges = Array(rows).fill("").map((edgeRow, rowIndex) => Array(columns + 1).fill("").map((edge, colIndex) => new VEdge(rowIndex, colIndex, "")));
    this.corners = Array(rows + 1).fill("").map((cornerRow, rowIndex) => Array(columns + 1).fill("").map((corner, colIndex) => new Corner(rowIndex, colIndex, "")));

    this.cells.forEach((cellRow, rowIndex) => {
      cellRow.forEach((cell, colIndex) => {

        // link cells -> edges
        cell.topEdge = this.hEdges[rowIndex][colIndex];
        cell.bottomEdge = this.hEdges[rowIndex + 1][colIndex];
        cell.leftEdge = this.vEdges[rowIndex][colIndex];
        cell.rightEdge = this.vEdges[rowIndex][colIndex + 1];

        // link edges -> cells
        cell.topEdge.bottomCell = cell;
        cell.bottomEdge.topCell = cell;
        cell.leftEdge.rightCell = cell;
        cell.rightEdge.leftCell = cell;

        // link cells -> corners
        cell.topLeftCorner = this.corners[rowIndex][colIndex];
        cell.topRightCorner = this.corners[rowIndex][colIndex + 1];
        cell.bottomLeftCorner = this.corners[rowIndex + 1][colIndex];
        cell.bottomRightCorner = this.corners[rowIndex + 1][colIndex + 1];

        // link corners -> cells
        cell.topLeftCorner.bottomRightCell = cell;
        cell.topRightCorner.bottomLeftCell = cell;
        cell.bottomLeftCorner.topRightCell = cell;
        cell.bottomRightCorner.topLeftCell = cell;
      });
    });

    // link corners -> edges and edges -> corners
    this.corners.forEach((cornerRow, rowIndex) => {
      cornerRow.forEach((corner, colIndex) => {
        if (rowIndex > 0) {
          corner.topEdge = this.vEdges[rowIndex - 1][colIndex];
          corner.topEdge.bottomCorner = corner;
        }
        if (rowIndex < rows) {
          corner.bottomEdge = this.vEdges[rowIndex][colIndex];
          corner.bottomEdge.topCorner = corner;
        }
        if (colIndex > 0) {
          corner.leftEdge = this.hEdges[rowIndex][colIndex - 1];
          corner.leftEdge.rightCorner = corner;
        }
        if (colIndex < columns) {
          corner.rightEdge = this.hEdges[rowIndex][colIndex];
          corner.rightEdge.leftCorner = corner;
        }
      });
    });
  }

  isSolved() {
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        if (!cell.isSatisfied()) return false;
      }
    }

    // Find an edge and follow its adjacent edges to see if we have a closed loop.
    let startEdge = null;
    for (const edgeRow of this.hEdges) {
      startEdge = edgeRow.find(edge => edge.value === "-");
      if (startEdge) break;
    }
    if (!startEdge) return false;

    let curEdge: HEdge | VEdge | null = startEdge;
    let nextEdge: HEdge | VEdge | null = null;
    let prevEdge: HEdge | VEdge | null = null;
    let edgeCount = 1;

    while (true) {
      if (curEdge instanceof HEdge) {
        nextEdge = curEdge.rightPath;
        if (nextEdge === prevEdge) {
          nextEdge = curEdge.leftPath;
        }
      } else {
        nextEdge = curEdge.topPath;
        if (nextEdge === prevEdge) {
          nextEdge = curEdge.bottomPath;
        }
      }

      if (nextEdge === null) return false;

      if (nextEdge === startEdge) {
        // Count all edges to ensure there are none outside the closed loop.
        let totalEdgeCount = 0
        for (const edgeRow of this.hEdges) {
          totalEdgeCount += edgeRow.filter(edge => edge.value === "-").length;
        }
        for (const edgeRow of this.vEdges) {
          totalEdgeCount += edgeRow.filter(edge => edge.value === "-").length;
        }
        return edgeCount === totalEdgeCount;
      }

      prevEdge = curEdge;
      curEdge = nextEdge;
      edgeCount++;
    }
  }
}

export default SlitherlinkBoard;