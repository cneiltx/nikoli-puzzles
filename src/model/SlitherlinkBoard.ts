import Cell from "./Cell";
import Corner from "./Corner";
import HEdge from "./HEdge";
import VEdge from "./VEdge";
import IEdgeCount from "./IEdgeCount";

class SlitherlinkBoard {
  rows: number;
  columns: number;
  cells: Cell[][] = [];
  hEdges: HEdge[][] = [];
  vEdges: VEdge[][] = [];
  corners: Corner[][] = [];

  private rawCellValues = [
    ["2", "2", "2", "3", "3", "1", ""],
    ["", "", "0", "2", "", "3", ""],
    ["", "", "", "", "", "", ""],
    ["3", "3", "", "", "3", "3", ""],
    ["", "", "2", "", "2", "", ""],
    ["3", "", "2", "", "2", "2", ""],
    ["3", "", "2", "", "", "3", ""]
  ];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.initializeNewBoard();
  }

  initializeNewBoard() {
    this.cells = this.rawCellValues.map((cellRow, rowIndex) => cellRow.map((cell, colIndex) => new Cell(rowIndex, colIndex, cell)));
    this.hEdges = Array(this.rows + 1).fill("").map((edgeRow, rowIndex) => Array(this.columns).fill("").map((edge, colIndex) => new HEdge(rowIndex, colIndex, "")));
    this.vEdges = Array(this.rows).fill("").map((edgeRow, rowIndex) => Array(this.columns + 1).fill("").map((edge, colIndex) => new VEdge(rowIndex, colIndex, "")));
    this.corners = Array(this.rows + 1).fill("").map((cornerRow, rowIndex) => Array(this.columns + 1).fill("").map((corner, colIndex) => new Corner(rowIndex, colIndex, "")));

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
        if (rowIndex < this.rows) {
          corner.bottomEdge = this.vEdges[rowIndex][colIndex];
          corner.bottomEdge.topCorner = corner;
        }
        if (colIndex > 0) {
          corner.leftEdge = this.hEdges[rowIndex][colIndex - 1];
          corner.leftEdge.rightCorner = corner;
        }
        if (colIndex < this.columns) {
          corner.rightEdge = this.hEdges[rowIndex][colIndex];
          corner.rightEdge.leftCorner = corner;
        }
      });
    });
  }

  reset() {
    for (const edgeRow of this.hEdges) {
      for (const edge of edgeRow) {
        edge.value = "";
      }
    }

    for (const edgeRow of this.vEdges) {
      for (const edge of edgeRow) {
        edge.value = "";
      }
    }
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

    let curEdge: HEdge | VEdge = startEdge;
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

  removeXEdges() {
    for (const edgeRow of this.hEdges) {
      for (const edge of edgeRow) {
        if (edge.value === "x") {
          edge.value = "";
        }
      }
    }
    for (const edgeRow of this.vEdges) {
      for (const edge of edgeRow) {
        if (edge.value === "x") {
          edge.value = "";
        }
      }
    }
  }

  applyOneTimeSolvePass() {
    // set cell possible edge counts based on cell values
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        switch (cell.value) {
          case "0":
            this.applyCellValueRule(cell, [1, 2]);
            break;
          case "1":
            this.applyCellValueRule(cell, [2]);
            break;
          case "3":
            this.applyCellValueRule(cell, [0]);
            break;
        }
      }
    }

    // remove 2 from outside corner edge counts
    for (const corner of this.corners[0]) {
      corner.topLeftEdgeCount.delete(2);
      corner.topRightEdgeCount.delete(2);
    }
    for (const corner of this.corners[this.rows]) {
      corner.bottomLeftEdgeCount.delete(2);
      corner.bottomRightEdgeCount.delete(2);
    }
    for (const cornerRow of this.corners) {
      cornerRow[0].topLeftEdgeCount.delete(2);
      cornerRow[0].bottomLeftEdgeCount.delete(2);
      cornerRow[this.columns].topRightEdgeCount.delete(2);
      cornerRow[this.columns].bottomRightEdgeCount.delete(2);
    }

    // remove 1 from outside board corners
    this.corners[0][0].topLeftEdgeCount.delete(1);
    this.corners[0][this.columns].topRightEdgeCount.delete(1);
    this.corners[this.rows][0].bottomLeftEdgeCount.delete(1);
    this.corners[this.rows][this.columns].bottomRightEdgeCount.delete(1);

    // handle special case of adjacent 3 cells
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        if (cell.value === "3" && cell.rightCell?.value === "3") {
          this.markEdge(
            cell.leftEdge,
            "-",
            cell.topLeftEdgeCount,
            cell.bottomLeftEdgeCount,
            cell.leftEdge.topCorner.bottomLeftEdgeCount,
            cell.leftEdge.bottomCorner.topLeftEdgeCount
          );
          this.markEdge(
            cell.rightEdge,
            "-",
            cell.topRightEdgeCount,
            cell.bottomRightEdgeCount,
            cell.rightCell.topLeftEdgeCount,
            cell.rightCell.bottomLeftEdgeCount
          );
          this.markEdge(
            cell.rightCell.rightEdge,
            "-",
            cell.rightCell.topRightEdgeCount,
            cell.rightCell.bottomRightEdgeCount,
            cell.rightCell.rightEdge.topCorner.bottomRightEdgeCount,
            cell.rightCell.rightEdge.bottomCorner.topRightEdgeCount
          );
          if (cell.topCell) {
            this.markEdge(
              cell.topCell.rightEdge,
              "x",
              cell.topCell.topRightEdgeCount,
              cell.topCell.bottomRightEdgeCount,
              cell.topCell.rightEdge.topCorner.bottomRightEdgeCount,
              cell.topCell.rightEdge.bottomCorner.topRightEdgeCount
            );
          }
          if (cell.bottomCell) {
            this.markEdge(
              cell.bottomCell.rightEdge,
              "x",
              cell.bottomCell.topRightEdgeCount,
              cell.bottomCell.bottomRightEdgeCount,
              cell.bottomCell.rightEdge.topCorner.bottomRightEdgeCount,
              cell.bottomCell.rightEdge.bottomCorner.topRightEdgeCount
            );
          }
        }

        if (cell.value === "3" && cell.bottomCell?.value === "3") {
          this.markEdge(
            cell.topEdge,
            "-",
            cell.topLeftEdgeCount,
            cell.topRightEdgeCount,
            cell.topEdge.leftCorner.topRightEdgeCount,
            cell.topEdge.rightCorner.topLeftEdgeCount
          );
          this.markEdge(
            cell.bottomEdge,
            "-",
            cell.bottomLeftEdgeCount,
            cell.bottomRightEdgeCount,
            cell.bottomCell.topLeftEdgeCount,
            cell.bottomCell.topRightEdgeCount
          );
          this.markEdge(
            cell.bottomCell.bottomEdge,
            "-",
            cell.bottomCell.bottomLeftEdgeCount,
            cell.bottomCell.bottomRightEdgeCount,
            cell.bottomCell.bottomEdge.leftCorner.bottomRightEdgeCount,
            cell.bottomCell.bottomEdge.rightCorner.bottomLeftEdgeCount
          );
          if (cell.leftCell) {
            this.markEdge(
              cell.leftCell.bottomEdge,
              "x",
              cell.leftCell.bottomLeftEdgeCount,
              cell.leftCell.bottomRightEdgeCount,
              cell.leftCell.bottomEdge.leftCorner.bottomRightEdgeCount,
              cell.leftCell.bottomEdge.rightCorner.bottomLeftEdgeCount
            );
          }
          if (cell.rightCell) {
            this.markEdge(
              cell.rightCell.bottomEdge,
              "x",
              cell.rightCell.bottomLeftEdgeCount,
              cell.rightCell.bottomRightEdgeCount,
              cell.rightCell.bottomEdge.leftCorner.bottomRightEdgeCount,
              cell.rightCell.bottomEdge.rightCorner.bottomLeftEdgeCount
            );
          }
        }
      }
    }
  }

  runSolveLoop() {
    let modified = true;

    while (modified) {
      modified = false;

      // apply deductions based on cell value and possible edge counts
      for (const cellRow of this.cells) {
        for (const cell of cellRow) {
          switch (cell.value) {
            case "1":
              modified ||= this.applyEdgeCountRule(cell, [0], [0]);
              modified ||= this.applyEdgeCountRule(cell, [1], [1]);
              break;
            case "2":
              modified ||= this.applyEdgeCountRule(cell, [0], [0, 1], [0, 2]);
              modified ||= this.applyEdgeCountRule(cell, [1], [0, 2]);
              modified ||= this.applyEdgeCountRule(cell, [2], [1, 2], [0, 2]);
              modified ||= this.applyEdgeCountRule(cell, [0, 1], [0]);
              modified ||= this.applyEdgeCountRule(cell, [1, 2], [2]);
              modified ||= this.applyEdgeCountRule(cell, [0, 2], [1], [0, 2]);
              break;
            case "3":
              modified ||= this.applyEdgeCountRule(cell, [1], [1]);
              modified ||= this.applyEdgeCountRule(cell, [2], [2]);
              break;
          }
        }
      }

      // apply deductions based on corner edge counts
      for (const cornerRow of this.corners) {
        for (const corner of cornerRow) {
          modified ||= this.applyEdgeCountRule(corner, [0], [1], [2]);
          modified ||= this.applyEdgeCountRule(corner, [1], [0, 2]);
          modified ||= this.applyEdgeCountRule(corner, [2], [1, 2], [0, 2]);
          modified ||= this.applyEdgeCountRule(corner, [1, 2], [2]);
          modified ||= this.applyEdgeCountRule(corner, [0, 2], [1], [2]);
        }
      }

      // mark excluded and included edges and update adjacent edge counts
      for (const cellRow of this.cells) {
        for (const cell of cellRow) {
          modified ||= this.updateEdges(
            cell.topLeftEdgeCount,
            cell.topEdge,
            cell.topRightEdgeCount,
            cell.topEdge.leftCorner.topRightEdgeCount,
            cell.topEdge.rightCorner.topLeftEdgeCount,
            cell.leftEdge,
            cell.bottomLeftEdgeCount,
            cell.leftEdge.topCorner.bottomLeftEdgeCount,
            cell.leftEdge.bottomCorner.topLeftEdgeCount,
          );
          modified ||= this.updateEdges(
            cell.topRightEdgeCount,
            cell.topEdge,
            cell.topLeftEdgeCount,
            cell.topEdge.leftCorner.topRightEdgeCount,
            cell.topEdge.rightCorner.topLeftEdgeCount,
            cell.rightEdge,
            cell.bottomRightEdgeCount,
            cell.rightEdge.topCorner.bottomRightEdgeCount,
            cell.rightEdge.bottomCorner.topRightEdgeCount
          );
          modified ||= this.updateEdges(
            cell.bottomLeftEdgeCount,
            cell.bottomEdge,
            cell.bottomRightEdgeCount,
            cell.bottomEdge.leftCorner.bottomRightEdgeCount,
            cell.bottomEdge.rightCorner.bottomLeftEdgeCount,
            cell.leftEdge,
            cell.topLeftEdgeCount,
            cell.leftEdge.topCorner.bottomLeftEdgeCount,
            cell.leftEdge.bottomCorner.topLeftEdgeCount,
          );
          modified ||= this.updateEdges(
            cell.bottomRightEdgeCount,
            cell.bottomEdge,
            cell.bottomLeftEdgeCount,
            cell.bottomEdge.leftCorner.bottomRightEdgeCount,
            cell.bottomEdge.rightCorner.bottomLeftEdgeCount,
            cell.rightEdge,
            cell.topRightEdgeCount,
            cell.rightEdge.topCorner.bottomRightEdgeCount,
            cell.rightEdge.bottomCorner.topRightEdgeCount
          );
        }
      }
    }
  }

  // returns true if any edge is modified
  updateEdges(
    cornerCount: Set<number>,
    adjacentHEdge: HEdge,
    adjacentHCornerCount: Set<number>,
    adjacentHCellLeftCornerCount: Set<number>,
    adjacentHCellRightCornerCount: Set<number>,
    adjacentVEdge: VEdge,
    adjacentVCornerCount: Set<number>,
    adjacentVCellTopCornerCount: Set<number>,
    adjacentVCellBottomCornerCount: Set<number>
  ): boolean {
    let modified = false;

    if (cornerCount.size === 1) {
      if (cornerCount.has(0)) {
        modified ||= this.markEdge(adjacentHEdge, "x", cornerCount, adjacentHCornerCount, adjacentHCellLeftCornerCount, adjacentHCellRightCornerCount);
        modified ||= this.markEdge(adjacentVEdge, "x", cornerCount, adjacentVCornerCount, adjacentVCellTopCornerCount, adjacentVCellBottomCornerCount);
      } else if (cornerCount.has(1)) {
        if (adjacentHEdge.value === "-") {
          modified ||= this.markEdge(adjacentVEdge, "x", cornerCount, adjacentVCornerCount, adjacentVCellTopCornerCount, adjacentVCellBottomCornerCount);
        }
        if (adjacentHEdge.value === "x") {
          modified ||= this.markEdge(adjacentVEdge, "-", cornerCount, adjacentVCornerCount, adjacentVCellTopCornerCount, adjacentVCellBottomCornerCount);
        }
        if (adjacentVEdge.value === "-") {
          modified ||= this.markEdge(adjacentHEdge, "x", cornerCount, adjacentHCornerCount, adjacentHCellLeftCornerCount, adjacentHCellRightCornerCount);
        }
        if (adjacentVEdge.value === "x") {
          modified ||= this.markEdge(adjacentHEdge, "-", cornerCount, adjacentHCornerCount, adjacentHCellLeftCornerCount, adjacentHCellRightCornerCount);
        }
      } else if (cornerCount.has(2)) {
        modified ||= this.markEdge(adjacentHEdge, "-", cornerCount, adjacentHCornerCount, adjacentHCellLeftCornerCount, adjacentHCellRightCornerCount);
        modified ||= this.markEdge(adjacentVEdge, "-", cornerCount, adjacentVCornerCount, adjacentVCellTopCornerCount, adjacentVCellBottomCornerCount);
      }
    }

    // handle case where both adjacent edges are included or excluded
    if (adjacentHEdge.value === "x" && adjacentVEdge.value === "x") {
      modified ||= cornerCount.delete(1);
      modified ||= cornerCount.delete(2);
    }

    if (adjacentHEdge.value === "-" && adjacentVEdge.value === "-") {
      modified ||= cornerCount.delete(0);
      modified ||= cornerCount.delete(1);
    }

    // handle special case of outer edges
    if (adjacentHEdge.value === "x" && adjacentHEdge.row === 0) {
      modified ||= adjacentHCellLeftCornerCount.delete(1);
      modified ||= adjacentHCellRightCornerCount.delete(1);
    }

    if (adjacentHEdge.value === "x" && adjacentHEdge.row === this.rows) {
      modified ||= adjacentHCellLeftCornerCount.delete(1);
      modified ||= adjacentHCellRightCornerCount.delete(1);
    }

    if (adjacentVEdge.value === "x" && adjacentVEdge.col === 0) {
      modified ||= adjacentVCellTopCornerCount.delete(1);
      modified ||= adjacentVCellBottomCornerCount.delete(1);
    }

    if (adjacentVEdge.value === "x" && adjacentVEdge.col === this.columns) {
      modified ||= adjacentVCellTopCornerCount.delete(1);
      modified ||= adjacentVCellBottomCornerCount.delete(1);
    }

    return modified;
  }

  // returns true if edge was modified
  markEdge(
    edge: HEdge | VEdge,
    value: string,
    cornerCount: Set<number>,
    adjacentCornerCount: Set<number>,
    adjacentCellCornerCount1: Set<number>,
    adjacentCellCornerCount2: Set<number>
  ): boolean {
    let modified = false;

    if (edge.value !== value) {
      modified = true;
      edge.value = value;

      if (value === "x") {
        cornerCount.delete(2);
        adjacentCornerCount.delete(2);
        adjacentCellCornerCount1.delete(2)
        adjacentCellCornerCount2.delete(2);
      } else if (value === "-") {
        cornerCount.delete(0);
        adjacentCornerCount.delete(0);
        adjacentCellCornerCount1.delete(0);
        adjacentCellCornerCount2.delete(0);
      }
    }

    return modified;
  }

  applyCellValueRule(cell: Cell, removeValues: number[]) {
    removeValues.forEach(value => {
      cell.topLeftEdgeCount.delete(value);
      cell.topRightEdgeCount.delete(value);
      cell.bottomLeftEdgeCount.delete(value);
      cell.bottomRightEdgeCount.delete(value);
    });
  }

  areEqual(set: Set<number>, array: number[]): boolean {
    if (set.size === array.length) {
      for (const setValue of Array.from(set)) {
        if (array.find(arrayValue => arrayValue === setValue) === undefined) {
          return false;
        };
      }
      for (const arrayValue of array) {
        if (!set.has(arrayValue)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  // returns true if any edge count is modified
  applyEdgeCountRule(item: IEdgeCount, edgeCount: number[], removeDiagonal: number[] = [], removeAdjacent: number[] = []): boolean {
    let modified = false;

    if (this.areEqual(item.topLeftEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified ||= item.bottomRightEdgeCount.delete(value);
      });
      removeAdjacent.forEach(value => {
        modified ||= item.bottomLeftEdgeCount.delete(value);
        modified ||= item.topRightEdgeCount.delete(value);
      });
    }
    if (this.areEqual(item.topRightEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified ||= item.bottomLeftEdgeCount.delete(value);
      });
      removeAdjacent.forEach(value => {
        modified ||= item.topLeftEdgeCount.delete(value);
        modified ||= item.bottomRightEdgeCount.delete(value);
      });
    }
    if (this.areEqual(item.bottomLeftEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified ||= item.topRightEdgeCount.delete(value);
      });
      removeAdjacent.forEach(value => {
        modified ||= item.topLeftEdgeCount.delete(value);
        modified ||= item.bottomRightEdgeCount.delete(value);
      });
    }
    if (this.areEqual(item.bottomRightEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified ||= item.topLeftEdgeCount.delete(value);
      });
      removeAdjacent.forEach(value => {
        modified ||= item.bottomLeftEdgeCount.delete(value);
        modified ||= item.topRightEdgeCount.delete(value);
      });
    }

    return modified;
  }
}

export default SlitherlinkBoard;