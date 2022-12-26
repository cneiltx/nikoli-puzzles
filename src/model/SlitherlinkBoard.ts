import Cell from "./Cell";
import Corner from "./Corner";
import HEdge from "./HEdge";
import VEdge from "./VEdge";
import IEdgeCount from "./IEdgeCount";

interface IRecursiveSolve {
  board: SlitherlinkBoard;
  solutions: number;
}

class SlitherlinkBoard {
  rows: number;
  columns: number;
  debugLevel: number;
  cells: Cell[][] = [];
  hEdges: HEdge[][] = [];
  vEdges: VEdge[][] = [];
  corners: Corner[][] = [];

  private prevDebugOutput = "";

  constructor(cellValues: string[][], debugLevel: number = 0) {
    this.rows = cellValues.length;
    this.columns = cellValues[0].length;

    for (const cellRow of cellValues) {
      if (cellRow.length !== this.columns) {
        throw new Error("Cell value rows do not have the same length.");
      }

      for (const value of cellRow) {
        if (value !== "" && value !== "0" && value !== "1" && value !== "2" && value !== "3") {
          throw new Error(`Invalid cell value '${value}'.`);
        }
      }
    }

    this.debugLevel = debugLevel;
    this.cells = cellValues.map((cellRow, rowIndex) => cellRow.map((cell, colIndex) => new Cell(rowIndex, colIndex, cell)));
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

  deepClone(): SlitherlinkBoard {
    const clone = new SlitherlinkBoard(this.cells.map(cellRow => cellRow.map(cell => cell.value)), this.debugLevel);
    clone.prevDebugOutput = this.prevDebugOutput;

    clone.hEdges.forEach((edgeRow, rowIndex) => {
      edgeRow.forEach((edge, colIndex) => {
        edge.value = this.hEdges[rowIndex][colIndex].value;
      });
    });
    clone.vEdges.forEach((edgeRow, rowIndex) => {
      edgeRow.forEach((edge, colIndex) => {
        edge.value = this.vEdges[rowIndex][colIndex].value;
      });
    });
    clone.corners.forEach((cornerRow, rowIndex) => {
      cornerRow.forEach((corner, colIndex) => {
        corner.value = this.corners[rowIndex][colIndex].value;
        this.cloneSet(this.corners[rowIndex][colIndex].topLeftEdgeCount, corner.topLeftEdgeCount);
        this.cloneSet(this.corners[rowIndex][colIndex].topRightEdgeCount, corner.topRightEdgeCount);
        this.cloneSet(this.corners[rowIndex][colIndex].bottomLeftEdgeCount, corner.bottomLeftEdgeCount);
        this.cloneSet(this.corners[rowIndex][colIndex].bottomRightEdgeCount, corner.bottomRightEdgeCount);
      });
    });

    return clone;
  }

  prettyPrint(): string {
    let output = "";
    let row1: string;
    let row2: string;
    let row3: string;
    let row4: string;

    this.cells.forEach((cellRow, rowIndex) => {
      row1 = Array.from(cellRow[0].topLeftCorner.topLeftEdgeCount).join(" ").padStart(5) +
        (cellRow[0].topCell?.leftEdge.value === "-" ? "|" : " ") +
        Array.from(cellRow[0].topLeftCorner.topRightEdgeCount).join(" ").padEnd(5);
      row2 = "     ■";
      row3 = Array.from(cellRow[0].topLeftCorner.bottomLeftEdgeCount).join(" ").padStart(5) +
        (cellRow[0].leftEdge.value === "-" ? "|" : " ") +
        Array.from(cellRow[0].topLeftCorner.bottomRightEdgeCount).join(" ").padEnd(5);

      switch (cellRow[0].leftEdge.value) {
        case "":
          row4 = " ".repeat(6);
          break;
        case "-":
          row4 = "|".padStart(6);
          break;
        case "x":
          row4 = "X".padStart(6);
          break;
      }

      cellRow.forEach((cell, colIndex) => {
        row1 += Array.from(cell.topRightCorner.topLeftEdgeCount).join(" ").padStart(8) +
          (cell.topCell?.rightEdge.value === "-" ? "|" : " ") +
          Array.from(cell.topRightCorner.topRightEdgeCount).join(" ").padEnd(5);

        switch (cell.topEdge.value) {
          case "":
            row2 += " ".repeat(13);
            break;
          case "-":
            row2 += "-".repeat(13);
            break;
          case "x":
            row2 += "      X      ";
            break;
        }

        row2 += "■";
        row3 += Array.from(cell.topRightCorner.bottomLeftEdgeCount).join(" ").padStart(8) +
          (cell.rightEdge.value === "-" ? "|" : " ") +
          Array.from(cell.topRightCorner.bottomRightEdgeCount).join(" ").padEnd(5);
        row4 += cell.value.padStart(7).padEnd(13)

        switch (cell.rightEdge.value) {
          case "":
            row4 += " ";
            break;
          case "-":
            row4 += "|";
            break;
          case "x":
            row4 += "X";
            break;
        }
      });

      output += [row1, row2, row3, row4].join("\n") + "\n";
    });

    row1 = Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.topLeftEdgeCount).join(" ").padStart(5) +
      (this.cells[this.rows - 1][0].leftEdge.value === "-" ? "|" : " ") +
      Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.topRightEdgeCount).join(" ").padEnd(5);
    row2 = "     ■";
    row3 = Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.bottomLeftEdgeCount).join(" ").padStart(5) +
      " " +
      Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.bottomRightEdgeCount).join(" ").padEnd(5);

    this.cells[this.rows - 1].forEach((cell, colIndex) => {
      row1 += Array.from(cell.bottomRightCorner.topLeftEdgeCount).join(" ").padStart(8) +
        (cell.rightEdge.value === "-" ? "|" : " ") +
        Array.from(cell.bottomRightCorner.topRightEdgeCount).join(" ").padEnd(5);

      switch (cell.bottomEdge.value) {
        case "":
          row2 += " ".repeat(13);
          break;
        case "-":
          row2 += "-".repeat(13);
          break;
        case "x":
          row2 += "      X      ";
          break;
      }

      row2 += "■";
      row3 += Array.from(cell.bottomRightCorner.bottomLeftEdgeCount).join(" ").padStart(8) +
        " " +
        Array.from(cell.bottomRightCorner.bottomRightEdgeCount).join(" ").padEnd(5);
    });

    output += [row1, row2, row3].join("\n") + "\n";
    const diffOutput = this.diff(output, this.prevDebugOutput);
    this.prevDebugOutput = output;
    return diffOutput;
  }

  diff(curr: string, prev: string): string {
    const diffColor = "\u001b[31m";
    const normalColor = "\u001b[0m";
    const deletedChar = "~";
    let diff = "";
    let inDiff = false;

    if (prev === "") {
      return curr;
    }

    const currLines = curr.split("\n");
    const prevLines = prev.split("\n");

    for (let lineIndex = 0; lineIndex < currLines.length; lineIndex++) {
      const currLine = currLines[lineIndex];

      if (lineIndex >= prevLines.length) {
        if (!inDiff) {
          diff += diffColor;
          inDiff = true;
        }

        diff += currLine + "\n";
      } else {
        const prevLine = prevLines[lineIndex];

        for (let charIndex = 0; charIndex < currLine.length; charIndex++) {
          if (charIndex >= prevLine.length) {
            if (!inDiff) {
              diff += diffColor;
              inDiff = true;
            }

            diff += currLine[charIndex];
          } else {
            if (currLine[charIndex] === prevLine[charIndex]) {
              if (inDiff) {
                diff += normalColor;
                inDiff = false;
              }

              diff += currLine[charIndex];
            } else {
              if (!inDiff) {
                diff += diffColor;
                inDiff = true;
              }

              diff += (currLine[charIndex] === " " ? deletedChar : currLine[charIndex]);
            }
          }
        }

        if (prevLine.length > currLine.length) {
          if (!inDiff) {
            diff += diffColor;
            inDiff = true;
          }

          diff += deletedChar;
        }

        diff += "\n";
      }
    }

    if (inDiff) {
      diff += normalColor;
      inDiff = false;
    }

    return diff;
  }

  apply(board: SlitherlinkBoard) {
    this.rows = board.rows;
    this.columns = board.columns;
    this.debugLevel = board.debugLevel;
    this.cells = board.cells;
    this.hEdges = board.hEdges;
    this.vEdges = board.vEdges;
    this.corners = board.corners;
  }

  solve(): number {
    this.reset();

    if (this.debugLevel > 1) {
      console.log("Initial state:\n" + this.prettyPrint());
    }

    this.applyOneTimeSolvePass();

    if (this.debugLevel > 1) {
      console.log("After one time solve pass:\n" + this.prettyPrint());
    }

    const result = this.recursiveSolve(0);
    this.apply(result.board);
    return result.solutions;
  }

  recursiveSolve(depth: number): IRecursiveSolve {
    const maxDepth = (this.rows + 1) * (this.columns + 1);

    if (depth > maxDepth) {
      if (this.debugLevel > 0) {
        console.log(`Exceeded max recursion depth of ${maxDepth}`);
      }
      return { board: this, solutions: 0 };
    }

    const solvable = this.runSolveLoop();

    if (this.debugLevel > 1) {
      console.log(`Recursive solve depth ${depth}:\n` + this.prettyPrint());
    } else if (this.debugLevel > 0) {
      console.log(`Recursive solve depth ${depth}`);
    }

    if (!solvable) {
      if (this.debugLevel > 0) {
        console.log("Solve loop reached an unsolvable state");
      }
      return { board: this, solutions: 0 };
    }

    if (this.isSolved()) {
      if (this.debugLevel > 0) {
        console.log("Solution found by solve loop");
      }
      return { board: this, solutions: 1 };
    }

    let selectedEdge: HEdge | VEdge | undefined;

    for (const edgeRow of this.hEdges) {
      for (const edge of edgeRow) {
        if (edge.value === "") {
          selectedEdge = edge;
          break;
        }
      }

      if (selectedEdge !== undefined) {
        break;
      }
    }

    if (selectedEdge === undefined) {
      for (const edgeRow of this.vEdges) {
        for (const edge of edgeRow) {
          if (edge.value === "") {
            selectedEdge = edge;
            break;
          }
        }

        if (selectedEdge !== undefined) {
          break;
        }
      }
    }

    if (selectedEdge === undefined) {
      if (this.debugLevel > 0) {
        console.log("No unset edges found");
      }

      return { board: this, solutions: 0 };
    } else {
      // first, try setting the selected edge
      let clone = this.deepClone();
      let cloneEdge = (
        selectedEdge instanceof HEdge ?
          clone.hEdges[selectedEdge.row][selectedEdge.col] :
          clone.vEdges[selectedEdge.row][selectedEdge.col]
      );
      clone.markEdge(cloneEdge, "-");

      if (this.debugLevel > 0) {
        console.log("Recursing with included edge");
      }

      const setResult = clone.recursiveSolve(depth + 1);

      // second, try unsetting the selected edge
      clone = this.deepClone();
      cloneEdge = (
        selectedEdge instanceof HEdge ?
          clone.hEdges[selectedEdge.row][selectedEdge.col] :
          clone.vEdges[selectedEdge.row][selectedEdge.col]
      );
      clone.markEdge(cloneEdge, "x");

      if (this.debugLevel > 0) {
        console.log("Recursing with excluded edge");
      }

      const unsetResult = clone.recursiveSolve(depth + 1);

      if (setResult.solutions > 0) {
        setResult.solutions += unsetResult.solutions;
        return setResult;
      } else {
        return unsetResult;
      }
    }
  }

  cloneSet(source: Set<number>, target: Set<number>) {
    target.clear();
    source.forEach(value => {
      target.add(value);
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

    // special case of adjacent 1 cells on outer edge
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        if ((cell.row === 0 || cell.row === this.rows - 1) && cell.value === "1" && cell.rightCell?.value === "1") {
          this.markEdge(cell.rightEdge, "x");
        }

        if ((cell.col === 0 || cell.col === this.columns - 1) && cell.value === "1" && cell.bottomCell?.value === "1") {
          this.markEdge(cell.bottomEdge, "x");
        }
      }
    }

    // special case of adjacent 3 cells
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        if (cell.value === "3" && cell.rightCell?.value === "3") {
          this.markEdge(cell.leftEdge, "-");
          this.markEdge(cell.rightEdge, "-");
          this.markEdge(cell.rightCell.rightEdge, "-");
          if (cell.topCell) {
            this.markEdge(cell.topCell.rightEdge, "x");
          }
          if (cell.bottomCell) {
            this.markEdge(cell.bottomCell.rightEdge, "x");
          }
        }

        if (cell.value === "3" && cell.bottomCell?.value === "3") {
          this.markEdge(cell.topEdge, "-");
          this.markEdge(cell.bottomEdge, "-");
          this.markEdge(cell.bottomCell.bottomEdge, "-");
          if (cell.leftCell) {
            this.markEdge(cell.leftCell.bottomEdge, "x");
          }
          if (cell.rightCell) {
            this.markEdge(cell.rightCell.bottomEdge, "x");
          }
        }
      }
    }
  }

  // returns false if the board is not solvable or we exceed maxIterations
  runSolveLoop(): boolean {
    let modified = true;
    let iteration = 0;
    const maxIterations = ((this.rows + 1) * (this.columns + 1)) ** 2;

    while (modified) {
      modified = false;
      iteration++;

      if (iteration > maxIterations) {
        if (this.debugLevel > 0) {
          console.log(`Solve loop exceeded max iterations of ${maxIterations}`);
        }
        return false;
      }

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

          // if any edge counts are empty, we have an unsolvable board
          if (corner.topLeftEdgeCount.size === 0 ||
            corner.topRightEdgeCount.size === 0 ||
            corner.bottomLeftEdgeCount.size === 0 ||
            corner.bottomRightEdgeCount.size === 0
          ) {
            if (this.debugLevel > 0) {
              console.log("Unsolvable due to empty edge count");
            }
            return false;
          }
        }
      }

      // mark excluded and included edges and update adjacent edge counts
      for (const cellRow of this.cells) {
        for (const cell of cellRow) {
          modified ||= this.updateEdges(cell, cell.topLeftCorner);
          modified ||= this.updateEdges(cell, cell.topRightCorner);
          modified ||= this.updateEdges(cell, cell.bottomLeftCorner);
          modified ||= this.updateEdges(cell, cell.bottomRightCorner);
        }
      }

      if (this.debugLevel > 1) {
        console.log(`After solve loop iteration ${iteration}:\n` + this.prettyPrint());
      }
    }

    if (this.debugLevel > 0) {
      console.log(`Solve loop completed after ${iteration} iterations`);
    }

    return true;
  }

  // returns true if any edge is modified
  updateEdges(
    cell: Cell,
    corner: Corner,
  ): boolean {
    let modified = false;
    let cornerCount: Set<number>;
    let adjacentHEdge: HEdge;
    let adjacentVEdge: VEdge;
    let adjacentHEdgeCornerCount: Set<number>;
    let adjacentVEdgeCornerCount: Set<number>;

    if (corner === cell.topLeftCorner) {
      cornerCount = cell.topLeftEdgeCount;
      adjacentHEdge = cell.topEdge;
      adjacentVEdge = cell.leftEdge;
      adjacentHEdgeCornerCount = cell.topLeftCorner.topRightEdgeCount;
      adjacentVEdgeCornerCount = cell.topLeftCorner.bottomLeftEdgeCount;
    } else if (corner === cell.topRightCorner) {
      cornerCount = cell.topRightEdgeCount;
      adjacentHEdge = cell.topEdge;
      adjacentVEdge = cell.rightEdge;
      adjacentHEdgeCornerCount = cell.topRightCorner.topLeftEdgeCount;
      adjacentVEdgeCornerCount = cell.topRightCorner.bottomRightEdgeCount;
    } else if (corner === cell.bottomLeftCorner) {
      cornerCount = cell.bottomLeftEdgeCount;
      adjacentHEdge = cell.bottomEdge;
      adjacentVEdge = cell.leftEdge;
      adjacentHEdgeCornerCount = cell.bottomLeftCorner.bottomRightEdgeCount;
      adjacentVEdgeCornerCount = cell.bottomLeftCorner.topLeftEdgeCount;
    } else {
      cornerCount = cell.bottomRightEdgeCount;
      adjacentHEdge = cell.bottomEdge;
      adjacentVEdge = cell.rightEdge;
      adjacentHEdgeCornerCount = cell.bottomRightCorner.bottomLeftEdgeCount;
      adjacentVEdgeCornerCount = cell.bottomRightCorner.topRightEdgeCount;
    }

    if (cornerCount.size === 1) {
      if (cornerCount.has(0)) {
        modified ||= this.markEdge(adjacentHEdge, "x");
        modified ||= this.markEdge(adjacentVEdge, "x");
      } else if (cornerCount.has(1)) {
        if (adjacentHEdge.value === "-") {
          modified ||= this.markEdge(adjacentVEdge, "x");
        }
        if (adjacentHEdge.value === "x") {
          modified ||= this.markEdge(adjacentVEdge, "-");
        }
        if (adjacentVEdge.value === "-") {
          modified ||= this.markEdge(adjacentHEdge, "x");
        }
        if (adjacentVEdge.value === "x") {
          modified ||= this.markEdge(adjacentHEdge, "-");
        }
      } else if (cornerCount.has(2)) {
        modified ||= this.markEdge(adjacentHEdge, "-");
        modified ||= this.markEdge(adjacentVEdge, "-");
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
    if (adjacentHEdgeCornerCount.size === 1 && (adjacentHEdge.row === 0 || adjacentHEdge.row === this.rows)) {
      if (adjacentHEdgeCornerCount.has(0)) {
        modified ||= this.markEdge(adjacentHEdge, "x");
      } else if (adjacentHEdgeCornerCount.has(1)) {
        modified ||= this.markEdge(adjacentHEdge, "-");
      }
    }

    if (adjacentVEdgeCornerCount.size === 1 && (adjacentVEdge.col === 0 || adjacentVEdge.col === this.columns)) {
      if (adjacentVEdgeCornerCount.has(0)) {
        modified ||= this.markEdge(adjacentVEdge, "x");
      } else if (adjacentVEdgeCornerCount.has(1)) {
        modified ||= this.markEdge(adjacentVEdge, "-");
      }
    }

    return modified;
  }

  // returns true if edge was modified
  markEdge(edge: HEdge | VEdge, value: string): boolean {
    let modified = false;

    if (edge.value !== value) {
      modified = true;
      edge.value = value;

      if (value === "x") {
        if (edge instanceof HEdge) {
          edge.leftCorner.topRightEdgeCount.delete(2);
          edge.rightCorner.topLeftEdgeCount.delete(2);
          edge.leftCorner.bottomRightEdgeCount.delete(2);
          edge.rightCorner.bottomLeftEdgeCount.delete(2);

          if (edge.row === 0) {
            edge.leftCorner.topRightEdgeCount.delete(1);
            edge.rightCorner.topLeftEdgeCount.delete(1);
          } else if (edge.row === this.rows) {
            edge.leftCorner.bottomRightEdgeCount.delete(1);
            edge.rightCorner.bottomLeftEdgeCount.delete(1);
          }
        } else {
          edge.topCorner.bottomLeftEdgeCount.delete(2);
          edge.bottomCorner.topLeftEdgeCount.delete(2);
          edge.topCorner.bottomRightEdgeCount.delete(2);
          edge.bottomCorner.topRightEdgeCount.delete(2);

          if (edge.col === 0) {
            edge.topCorner.bottomLeftEdgeCount.delete(1);
            edge.bottomCorner.topLeftEdgeCount.delete(1);
          } else if (edge.col === this.columns) {
            edge.topCorner.bottomRightEdgeCount.delete(1);
            edge.bottomCorner.topRightEdgeCount.delete(1);
          }
        }
      } else if (value === "-") {
        if (edge instanceof HEdge) {
          edge.leftCorner.topRightEdgeCount.delete(0);
          edge.rightCorner.topLeftEdgeCount.delete(0);
          edge.leftCorner.bottomRightEdgeCount.delete(0);
          edge.rightCorner.bottomLeftEdgeCount.delete(0);
        } else {
          edge.topCorner.bottomLeftEdgeCount.delete(0);
          edge.bottomCorner.topLeftEdgeCount.delete(0);
          edge.topCorner.bottomRightEdgeCount.delete(0);
          edge.bottomCorner.topRightEdgeCount.delete(0);
        }
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