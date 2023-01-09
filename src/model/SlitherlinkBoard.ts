import Cell from './Cell';
import Corner from './Corner';
import VEdge from './VEdge';
import HEdge from './HEdge';
import IEdgeCount from './IEdgeCount';
import MultipleSolutionsError from './MultipleSolutionsError';
import NoSolutionError from './NoSolutionError';

interface IRecursiveSolveResult {
  board: SlitherlinkBoard;
  solutions: number;
}

interface ISolvedCheckResult {
  isValid: boolean;
  isSolved: boolean;
}

interface IMarkEdgeResult {
  isModified: boolean;
  isConflict: boolean;
}

class SlitherlinkBoard {
  rows: number;
  columns: number;
  debugLevel: number;
  cells: Cell[][] = [];
  vEdges: VEdge[][] = [];
  hEdges: HEdge[][] = [];
  corners: Corner[][] = [];

  private prevDebugOutput = '';

  constructor(cellValues: string[][], debugLevel: number = 0) {
    this.rows = cellValues.length;
    this.columns = cellValues[0].length;

    for (const cellRow of cellValues) {
      if (cellRow.length !== this.columns) {
        throw new Error('Cell value rows do not have the same length.');
      }

      for (const value of cellRow) {
        if (value !== '' && value !== '0' && value !== '1' && value !== '2' && value !== '3') {
          throw new Error(`Invalid cell value '${value}'.`);
        }
      }
    }

    this.debugLevel = debugLevel;
    this.cells = cellValues.map((cellRow, rowIndex) => {
      return cellRow.map((cell, colIndex) => {
        return new Cell(rowIndex, colIndex, cell)
      });
    });

    this.hEdges = Array(this.rows).fill('').map((edgeRow, rowIndex) => {
      return Array(this.columns + 1).fill('').map((edge, colIndex) => new HEdge(rowIndex, colIndex, ''))
    });

    this.vEdges = Array(this.rows + 1).fill('').map((edgeRow, rowIndex) => {
      return Array(this.columns).fill('').map((edge, colIndex) => new VEdge(rowIndex, colIndex, ''))
    });

    this.corners = Array(this.rows + 1).fill('').map((cornerRow, rowIndex) => {
      return Array(this.columns + 1).fill('').map((corner, colIndex) => new Corner(rowIndex, colIndex, ''))
    });

    this.cells.forEach((cellRow, rowIndex) => {
      cellRow.forEach((cell, colIndex) => {

        // link cells -> edges
        cell.topEdge = this.vEdges[rowIndex][colIndex];
        cell.bottomEdge = this.vEdges[rowIndex + 1][colIndex];
        cell.leftEdge = this.hEdges[rowIndex][colIndex];
        cell.rightEdge = this.hEdges[rowIndex][colIndex + 1];

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
          corner.topEdge = this.hEdges[rowIndex - 1][colIndex];
          corner.topEdge.bottomCorner = corner;
        }
        if (rowIndex < this.rows) {
          corner.bottomEdge = this.hEdges[rowIndex][colIndex];
          corner.bottomEdge.topCorner = corner;
        }
        if (colIndex > 0) {
          corner.leftEdge = this.vEdges[rowIndex][colIndex - 1];
          corner.leftEdge.rightCorner = corner;
        }
        if (colIndex < this.columns) {
          corner.rightEdge = this.vEdges[rowIndex][colIndex];
          corner.rightEdge.leftCorner = corner;
        }
      });
    });
  }

  private deepClone(): SlitherlinkBoard {
    const clone = new SlitherlinkBoard(this.cells.map(cellRow => cellRow.map(cell => cell.value)), this.debugLevel);
    clone.prevDebugOutput = this.prevDebugOutput;

    clone.vEdges.forEach((edgeRow, rowIndex) => {
      edgeRow.forEach((edge, colIndex) => {
        edge.value = this.vEdges[rowIndex][colIndex].value;
      });
    });
    clone.hEdges.forEach((edgeRow, rowIndex) => {
      edgeRow.forEach((edge, colIndex) => {
        edge.value = this.hEdges[rowIndex][colIndex].value;
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

  private prettyPrint(): string {
    let output = '';
    let row1: string;
    let row2: string;
    let row3: string;
    let row4: string;

    this.cells.forEach((cellRow, rowIndex) => {
      row1 = Array.from(cellRow[0].topLeftCorner.topLeftEdgeCount).join(' ').padStart(5) + (cellRow[0].topCell?.leftEdge.value === '-' ? '|' : ' ') +
        Array.from(cellRow[0].topLeftCorner.topRightEdgeCount).join(' ').padEnd(5);
      row2 = '     ■';
      row3 = Array.from(cellRow[0].topLeftCorner.bottomLeftEdgeCount).join(' ').padStart(5) + (cellRow[0].leftEdge.value === '-' ? '|' : ' ') +
        Array.from(cellRow[0].topLeftCorner.bottomRightEdgeCount).join(' ').padEnd(5);

      switch (cellRow[0].leftEdge.value) {
        case '':
          row4 = ' '.repeat(6);
          break;
        case '-':
          row4 = '|'.padStart(6);
          break;
        case 'x':
          row4 = 'X'.padStart(6);
          break;
      }

      cellRow.forEach((cell, colIndex) => {
        row1 += Array.from(cell.topRightCorner.topLeftEdgeCount).join(' ').padStart(8) + (cell.topCell?.rightEdge.value === '-' ? '|' : ' ') +
          Array.from(cell.topRightCorner.topRightEdgeCount).join(' ').padEnd(5);

        switch (cell.topEdge.value) {
          case '':
            row2 += ' '.repeat(13);
            break;
          case '-':
            row2 += '-'.repeat(13);
            break;
          case 'x':
            row2 += '      X      ';
            break;
        }

        row2 += '■';
        row3 += Array.from(cell.topRightCorner.bottomLeftEdgeCount).join(' ').padStart(8) + (cell.rightEdge.value === '-' ? '|' : ' ') +
          Array.from(cell.topRightCorner.bottomRightEdgeCount).join(' ').padEnd(5);
        row4 += cell.value.padStart(7).padEnd(13)

        switch (cell.rightEdge.value) {
          case '':
            row4 += ' ';
            break;
          case '-':
            row4 += '|';
            break;
          case 'x':
            row4 += 'X';
            break;
        }
      });

      output += [row1, row2, row3, row4].join('\n') + '\n';
    });

    row1 = Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.topLeftEdgeCount).join(' ').padStart(5) +
      (this.cells[this.rows - 1][0].leftEdge.value === '-' ? '|' : ' ') +
      Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.topRightEdgeCount).join(' ').padEnd(5);
    row2 = '     ■';
    row3 = Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.bottomLeftEdgeCount).join(' ').padStart(5) +
      ' ' + Array.from(this.cells[this.rows - 1][0].bottomLeftCorner.bottomRightEdgeCount).join(' ').padEnd(5);

    this.cells[this.rows - 1].forEach((cell, colIndex) => {
      row1 += Array.from(cell.bottomRightCorner.topLeftEdgeCount).join(' ').padStart(8) + (cell.rightEdge.value === '-' ? '|' : ' ') +
        Array.from(cell.bottomRightCorner.topRightEdgeCount).join(' ').padEnd(5);

      switch (cell.bottomEdge.value) {
        case '':
          row2 += ' '.repeat(13);
          break;
        case '-':
          row2 += '-'.repeat(13);
          break;
        case 'x':
          row2 += '      X      ';
          break;
      }

      row2 += '■';
      row3 += Array.from(cell.bottomRightCorner.bottomLeftEdgeCount).join(' ').padStart(8) +
        ' ' + Array.from(cell.bottomRightCorner.bottomRightEdgeCount).join(' ').padEnd(5);
    });

    output += [row1, row2, row3].join('\n') + '\n';
    const diffOutput = this.diff(output, this.prevDebugOutput);
    this.prevDebugOutput = output;
    return diffOutput;
  }

  private diff(curr: string, prev: string): string {
    const diffColor = '\u001b[31m';
    const normalColor = '\u001b[0m';
    const deletedChar = '~';
    let diff = '';
    let inDiff = false;

    if (prev === '') {
      return curr;
    }

    const currLines = curr.split('\n');
    const prevLines = prev.split('\n');

    for (let lineIndex = 0; lineIndex < currLines.length; lineIndex++) {
      const currLine = currLines[lineIndex];

      if (lineIndex >= prevLines.length) {
        if (!inDiff) {
          diff += diffColor;
          inDiff = true;
        }

        diff += currLine + '\n';
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

              diff += (currLine[charIndex] === ' ' ? deletedChar : currLine[charIndex]);
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

        diff += '\n';
      }
    }

    if (inDiff) {
      diff += normalColor;
      inDiff = false;
    }

    return diff;
  }

  private apply(board: SlitherlinkBoard) {
    this.rows = board.rows;
    this.columns = board.columns;
    this.debugLevel = board.debugLevel;
    this.cells = board.cells;
    this.vEdges = board.vEdges;
    this.hEdges = board.hEdges;
    this.corners = board.corners;
  }

  solve() {
    this.resetBoard();

    if (this.debugLevel > 1) {
      console.log('Initial state:\n' + this.prettyPrint());
    }

    this.runOneTimeSolvePass();

    const result = this.recursiveSolve(0);

    if (result.solutions === 0) {
      throw new NoSolutionError();
    } else {
      this.apply(result.board);
    }

    this.removeDeletedEdges();
  }

  private iterativeSolve() {
    const boardQueue: SlitherlinkBoard[] = [this];
    let solutions = 0;
    let iteration = 0;

    while (boardQueue.length > 0) {
      let board: SlitherlinkBoard = boardQueue.shift()!;
      iteration++;

      if (this.debugLevel > 0) {
        console.log(`Solve iteration ${iteration}`);
      }

      if (!board.runSolveLoop()) {
        if (this.debugLevel > 0) {
          console.log(`No solution found: conflict detected`);
        }
        continue;
      }

      let solvedResult = board.runSolvedCheck();
      if (!solvedResult.isValid) {
        if (this.debugLevel > 0) {
          console.log('No solution found: board is invalid');
        }
        continue;
      }

      if (solvedResult.isSolved) {
        if (this.debugLevel > 0) {
          console.log('Solution found');
        }

        solutions++;

        if (solutions > 1) {
          if (this.debugLevel > 0) {
            console.log('Multiple solutions found');
          }
          throw new MultipleSolutionsError();
        } else {
          this.apply(board);
        }
      } else {
        let selectedEdge: VEdge | HEdge | undefined;

        for (const edgeRow of board.vEdges) {
          for (const edge of edgeRow) {
            if (edge.value === '') {
              selectedEdge = edge;
              break;
            }
          }

          if (selectedEdge) {
            break;
          }
        }

        if (selectedEdge === undefined) {
          for (const edgeRow of board.hEdges) {
            for (const edge of edgeRow) {
              if (edge.value === '') {
                selectedEdge = edge;
                break;
              }
            }

            if (selectedEdge) {
              break;
            }
          }
        }

        if (selectedEdge === undefined) {
          if (this.debugLevel > 0) {
            console.log('No solution found: no unset edges');
          }
        } else {
          // first, try setting the selected edge
          let clone = board.deepClone();
          let cloneEdge = selectedEdge instanceof VEdge ?
            clone.vEdges[selectedEdge.row][selectedEdge.col] : clone.hEdges[selectedEdge.row][selectedEdge.col];
          clone.markEdge(cloneEdge, '-');
          boardQueue.push(clone);

          if (this.debugLevel > 0) {
            console.log(`Enqueueing board with included ${cloneEdge instanceof HEdge ? 'horizontal' : 'vertical'} edge {${cloneEdge.row}, ${cloneEdge.col}}`);
          }

          // second, try unsetting the selected edge
          clone = board.deepClone();
          cloneEdge = selectedEdge instanceof VEdge ?
            clone.vEdges[selectedEdge.row][selectedEdge.col] : clone.hEdges[selectedEdge.row][selectedEdge.col];
          clone.markEdge(cloneEdge, 'x');
          boardQueue.push(clone);

          if (this.debugLevel > 0) {
            console.log(`Enqueueing board with excluded ${cloneEdge instanceof HEdge ? 'horizontal' : 'vertical'} edge {${cloneEdge.row}, ${cloneEdge.col}}`);
          }
        }
      }
    }

    if (solutions === 0) {
      throw new NoSolutionError();
    }
  }

  private recursiveSolve(depth: number): IRecursiveSolveResult {
    if (this.debugLevel > 0) {
      console.log(`Recursive solve depth ${depth}`);
    }

    if (!this.runSolveLoop()) {
      if (this.debugLevel > 0) {
        console.log(`No solution found: conflict detected`);
      }
      return { board: this, solutions: 0 };
    }

    let solvedResult = this.runSolvedCheck();

    if (!solvedResult.isValid) {
      if (this.debugLevel > 0) {
        console.log('No solution found: board is invalid');
      }
      return { board: this, solutions: 0 };
    }

    if (solvedResult.isSolved) {
      if (this.debugLevel > 0) {
        console.log('Solution found');
      }
      return { board: this, solutions: 1 };
    }

    let selectedEdge: VEdge | HEdge | undefined;

    for (const edgeRow of this.vEdges) {
      for (const edge of edgeRow) {
        if (edge.value === '') {
          selectedEdge = edge;
          break;
        }
      }

      if (selectedEdge) {
        break;
      }
    }

    if (selectedEdge === undefined) {
      for (const edgeRow of this.hEdges) {
        for (const edge of edgeRow) {
          if (edge.value === '') {
            selectedEdge = edge;
            break;
          }
        }

        if (selectedEdge) {
          break;
        }
      }
    }

    if (selectedEdge === undefined) {
      if (this.debugLevel > 0) {
        console.log('No solution found: no unset edges');
      }

      return { board: this, solutions: 0 };
    } else {
      // first, try setting the selected edge
      let clone = this.deepClone();
      let cloneEdge = selectedEdge instanceof VEdge ?
        clone.vEdges[selectedEdge.row][selectedEdge.col] : clone.hEdges[selectedEdge.row][selectedEdge.col];
      clone.markEdge(cloneEdge, '-');

      if (this.debugLevel > 0) {
        console.log(`Recursing with included ${cloneEdge instanceof HEdge ? 'horizontal' : 'vertical'} edge {${cloneEdge.row}, ${cloneEdge.col}}`);
      }

      const setResult = clone.recursiveSolve(depth + 1);

      if (setResult.solutions > 1) {
        throw new MultipleSolutionsError();
      }

      // second, try unsetting the selected edge
      clone = this.deepClone();
      cloneEdge = selectedEdge instanceof VEdge ?
        clone.vEdges[selectedEdge.row][selectedEdge.col] : clone.hEdges[selectedEdge.row][selectedEdge.col];
      clone.markEdge(cloneEdge, 'x');

      if (this.debugLevel > 0) {
        console.log(`Recursing with excluded edge {${cloneEdge.row}, ${cloneEdge.col}}`);
      }

      const unsetResult = clone.recursiveSolve(depth + 1);

      if (setResult.solutions + unsetResult.solutions > 1) {
        throw new MultipleSolutionsError();
      }

      if (setResult.solutions === 1) {
        return setResult;
      } else {
        return unsetResult;
      }
    }
  }

  resetBoard() {
    for (const edgeRow of this.vEdges) {
      for (const edge of edgeRow) {
        edge.value = '';
      }
    }

    for (const edgeRow of this.hEdges) {
      for (const edge of edgeRow) {
        edge.value = '';
      }
    }
  }

  runSolvedCheck(): ISolvedCheckResult {
    let totalEdgeCount = 0
    for (const edgeRow of this.vEdges) {
      totalEdgeCount += edgeRow.filter(edge => edge.value === '-').length;
    }
    for (const edgeRow of this.hEdges) {
      totalEdgeCount += edgeRow.filter(edge => edge.value === '-').length;
    }

    let edgeMap = new Map();

    // look for closed loops
    while (true) {

      // Find an edge and follow its adjacent edges to see if we have a closed loop.
      let startEdge = null;
      for (const edgeRow of this.vEdges) {
        startEdge = edgeRow.find(edge => edge.value === '-' && !edgeMap.has(edge));
        if (startEdge) break;
      }
      if (!startEdge) return { isValid: true, isSolved: false };

      let curEdge: VEdge | HEdge = startEdge;
      let nextEdge: VEdge | HEdge | null = null;
      let edgeCount = 0;

      while (true) {
        edgeMap.set(curEdge, curEdge);
        edgeCount++;

        if (curEdge instanceof VEdge) {
          nextEdge = curEdge.rightPath && (!edgeMap.has(curEdge.rightPath) || (edgeCount > 2 && curEdge.rightPath === startEdge)) ?
            curEdge.rightPath : curEdge.leftPath;
        } else {
          nextEdge = curEdge.topPath && (!edgeMap.has(curEdge.topPath) || (edgeCount > 2 && curEdge.topPath === startEdge)) ?
            curEdge.topPath : curEdge.bottomPath;
        }

        if (nextEdge === null || (edgeMap.has(nextEdge) && (nextEdge !== startEdge || edgeCount <= 2))) {
          break;
        } else if (nextEdge === startEdge) {
          if (edgeCount === totalEdgeCount) {
            for (const cellRow of this.cells) {
              for (const cell of cellRow) {
                if (!cell.isSatisfied) return { isValid: false, isSolved: false };
              }
            }
            return { isValid: true, isSolved: true };
          } else {
            if (this.debugLevel > 0) {
              console.log('Board has closed loop with edges outside loop');
            }
            return { isValid: false, isSolved: false };
          }
        }

        curEdge = nextEdge;
      }
    }
  }

  private removeDeletedEdges() {
    for (const edgeRow of this.vEdges) {
      for (const edge of edgeRow) {
        if (edge.value === 'x') {
          edge.value = '';
        }
      }
    }
    for (const edgeRow of this.hEdges) {
      for (const edge of edgeRow) {
        if (edge.value === 'x') {
          edge.value = '';
        }
      }
    }
  }

  runOneTimeSolvePass() {
    this.runOneTimeSolvePassEdgeCounts();
  }

  private runOneTimeSolvePassWikipedia() {
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        // 0 cell
        if (cell.value === '0') {
          this.markEdges([cell.leftEdge, cell.topEdge, cell.rightEdge, cell.bottomEdge], 'x');
        }

        if (cell.isCornerCell) {
          switch (cell.value) {
            case '1':
              // corner 1's
              this.markEdges([cell.outerHEdge, cell.outerVEdge], 'x');
              break;
            case '2':
              // corner 2's
              this.markEdges([cell.innerHCell?.outerVEdge, cell.innerVCell?.outerHEdge], '-');
              break;
            case '3':
              // corner 3's
              this.markEdges([cell.outerHEdge, cell.outerVEdge], '-');
              break;
          }
        }

        // adjacent 1's on outer edge
        if (cell.value === '1' && cell.outerHEdge && cell.bottomCell?.value === '1') {
          this.markEdge(cell.bottomEdge, 'x');
        }

        if (cell.value === '1' && cell.outerVEdge && cell.rightCell?.value === '1') {
          this.markEdge(cell.rightEdge, 'x');
        }

        // adjacent 3's
        if (cell.value === '3' && cell.rightCell?.value === '3') {
          this.markEdges([cell.leftEdge, cell.rightEdge, cell.rightCell.rightEdge], '-');
          this.markEdges([cell.topCell?.rightEdge, cell.bottomCell?.rightEdge], 'x');
        }

        if (cell.value === '3' && cell.bottomCell?.value === '3') {
          this.markEdges([cell.topEdge, cell.bottomEdge, cell.bottomCell.bottomEdge], '-');
          this.markEdges([cell.leftCell?.bottomEdge, cell.rightCell?.bottomEdge], 'x');
        }

        if (cell.value === '3') {
          // adjacent 3 and 0
          if (cell.leftCell?.value === '0') {
            this.markEdges([cell.topEdge, cell.rightEdge, cell.bottomEdge, cell.topCell?.leftEdge, cell.bottomCell?.leftEdge], '-');
          } else if (cell.topCell?.value === '0') {
            this.markEdges([cell.leftEdge, cell.rightEdge, cell.bottomEdge, cell.leftCell?.topEdge, cell.rightCell?.topEdge], '-');
          } else if (cell.rightCell?.value === '0') {
            this.markEdges([cell.leftEdge, cell.topEdge, cell.bottomEdge, cell.topCell?.rightEdge, cell.bottomCell?.rightEdge], '-');
          } else if (cell.bottomCell?.value === '0') {
            this.markEdges([cell.leftEdge, cell.topEdge, cell.rightEdge, cell.leftCell?.bottomEdge, cell.rightCell?.bottomEdge], '-');
          }

          // diagonally adjacent 3's separated by 2's
          let tempCell = cell.bottomLeftCell;
          while (tempCell?.value === '2') {
            tempCell = tempCell.bottomLeftCell;
          }
          if (tempCell?.value === '3') {
            this.markEdges([cell.topEdge, cell.rightEdge, tempCell.leftEdge, tempCell.bottomEdge], '-');
          }

          tempCell = cell.bottomRightCell;
          while (tempCell?.value === '2') {
            tempCell = tempCell.bottomRightCell;
          }
          if (tempCell?.value === '3') {
            this.markEdges([cell.leftEdge, cell.topEdge, tempCell.rightEdge, tempCell.bottomEdge], '-');
          }
        }
      }
    }

    if (this.debugLevel > 1) {
      console.log('After one time solve pass:\n' + this.prettyPrint());
    }
  }

  // returns false if any conflicts occur
  runSolveLoop(): boolean {
    return this.runSolveLoopEdgeCounts();
  }

  // returns false if any conflicts occur
  private runSolveLoopWikipedia(): boolean {
    let modified = true;
    let iteration = 0;

    while (modified) {
      modified = false;
      iteration++;
      let conflict = false;

      for (const cellRow of this.cells) {
        for (const cell of cellRow) {
          if (cell.value === '0') {
            // check cell count
            if (cell.includedEdges.length > 0) {
              if (this.debugLevel > 0) {
                console.log(`Cell value conflict for cell {${cell.row}, ${cell.col}}`);
              }
              return false;
            }
          } else if (cell.value === '1') {
            if (cell.includedEdges.length === 1) {
              const edgeResult = this.markEdges(cell.unmarkedEdges, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            } else if (cell.excludedEdges.length === 3) {
              const edgeResult = this.markEdges(cell.unmarkedEdges, '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            // 1 with incoming line and deleted line away or outer edge
            if ((cell.topLeftCorner.topEdge?.value === '-' && (!cell.topLeftCorner.leftEdge || cell.topLeftCorner.leftEdge.value === 'x')) ||
              (cell.topLeftCorner.leftEdge?.value === '-' && (!cell.topLeftCorner.topEdge || cell.topLeftCorner.topEdge.value === 'x'))
            ) {
              const edgeResult = this.markEdges([cell.rightEdge, cell.bottomEdge], 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if ((cell.topRightCorner.topEdge?.value === '-' && (!cell.topRightCorner.rightEdge || cell.topRightCorner.rightEdge.value === 'x')) ||
              (cell.topRightCorner.rightEdge?.value === '-' && (!cell.topRightCorner.topEdge || cell.topRightCorner.topEdge.value === 'x'))
            ) {
              const edgeResult = this.markEdges([cell.leftEdge, cell.bottomEdge], 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if ((cell.bottomLeftCorner.bottomEdge?.value === '-' && (!cell.bottomLeftCorner.leftEdge || cell.bottomLeftCorner.leftEdge.value === 'x')) ||
              (cell.bottomLeftCorner.leftEdge?.value === '-' && (!cell.bottomLeftCorner.bottomEdge || cell.bottomLeftCorner.bottomEdge?.value === 'x'))
            ) {
              const edgeResult = this.markEdges([cell.topEdge, cell.rightEdge], 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if ((cell.bottomRightCorner.bottomEdge?.value === '-' && (!cell.bottomRightCorner.rightEdge || cell.bottomRightCorner.rightEdge?.value === 'x')) ||
              (cell.bottomRightCorner.rightEdge?.value === '-' && (!cell.bottomRightCorner.bottomEdge || cell.bottomRightCorner.bottomEdge?.value === 'x'))
            ) {
              const edgeResult = this.markEdges([cell.leftEdge, cell.topEdge], 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            // 1 with incoming line and opposite edges deleted
            if (cell.topEdge.value === 'x' && cell.leftEdge.value === 'x') {
              if (cell.bottomRightCorner.bottomEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.bottomRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.bottomRightCorner.rightEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.bottomRightCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.topEdge.value === 'x' && cell.rightEdge.value === 'x') {
              if (cell.bottomLeftCorner.bottomEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.bottomLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.bottomLeftCorner.leftEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.bottomLeftCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomEdge.value === 'x' && cell.leftEdge.value === 'x') {
              if (cell.topRightCorner.topEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.topRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.topRightCorner.rightEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.topRightCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomEdge.value === 'x' && cell.rightEdge.value === 'x') {
              if (cell.topLeftCorner.topEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.topLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.topLeftCorner.leftEdge?.value === '-') {
                const edgeResult = this.markEdge(cell.topLeftCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            // diagonally adjacent 1's with inner or outer edges deleted
            if (cell.bottomLeftCell?.value === '1') {
              if (cell.bottomEdge.value === 'x' && cell.leftEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomLeftCell.topEdge, cell.bottomLeftCell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.topEdge.value === 'x' && cell.rightEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomLeftCell.bottomEdge, cell.bottomLeftCell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }

              if (cell.bottomLeftCell.topEdge.value === 'x' && cell.bottomLeftCell.rightEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomEdge, cell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.bottomLeftCell.bottomEdge.value === 'x' && cell.bottomLeftCell.leftEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.topEdge, cell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomRightCell?.value === '1') {
              if (cell.bottomEdge.value === 'x' && cell.rightEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomRightCell.topEdge, cell.bottomRightCell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.topEdge.value === 'x' && cell.leftEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomRightCell.bottomEdge, cell.bottomRightCell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }

              if (cell.bottomRightCell.topEdge.value === 'x' && cell.bottomRightCell.leftEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomEdge, cell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.bottomRightCell.bottomEdge.value === 'x' && cell.bottomRightCell.rightEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.topEdge, cell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            // check cell count
            if (cell.includedEdges.length > 1 || cell.excludedEdges.length > 3) {
              if (this.debugLevel > 0) {
                console.log(`Cell value conflict for cell {${cell.row}, ${cell.col}}`);
              }
              return false;
            }
          } else if (cell.value === '2') {
            if (cell.includedEdges.length === 2) {
              const edgeResult = this.markEdges(cell.unmarkedEdges, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            } else if (cell.excludedEdges.length === 2) {
              const edgeResult = this.markEdges(cell.unmarkedEdges, '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            // 2 with incoming line and non-adjacent deleted edge
            if (cell.topLeftCorner.leftEdge?.value === '-') {
              if (cell.bottomEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.rightEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topLeftCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.rightEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.bottomEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topLeftCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.topLeftCorner.topEdge?.value === '-') {
              if (cell.bottomEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.rightEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.rightEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.bottomEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.topRightCorner.rightEdge?.value === '-') {
              if (cell.bottomEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.leftEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topRightCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.leftEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.bottomEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topRightCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.topRightCorner.topEdge?.value === '-') {
              if (cell.bottomEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.leftEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.leftEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.bottomEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.topRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomLeftCorner.leftEdge?.value === '-') {
              if (cell.topEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.rightEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomLeftCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.rightEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.topEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomLeftCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomLeftCorner.bottomEdge?.value === '-') {
              if (cell.topEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.rightEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.rightEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.topEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomRightCorner.rightEdge?.value === '-') {
              if (cell.topEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.leftEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomRightCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.leftEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.topEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomRightCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomRightCorner.bottomEdge?.value === '-') {
              if (cell.topEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.leftEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.leftEdge.value === 'x') {
                let edgeResult = this.markEdge(cell.topEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                edgeResult = this.markEdge(cell.bottomRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            // 2 with one included edge, deleted adjacent edge, and deleted opposite corner edge
            if (cell.includedEdges.length === 1) {
              if ((cell.topEdge.value === '-' && cell.leftEdge.value === 'x') || (cell.topEdge.value === 'x' && cell.leftEdge.value === '-')) {
                if (!cell.bottomRightCorner.bottomEdge || cell.bottomRightCorner.bottomEdge.value === 'x') {
                  const edgeResult = this.markEdge(cell.bottomRightCorner.rightEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                } else if (!cell.bottomRightCorner.rightEdge || cell.bottomRightCorner.rightEdge?.value === 'x') {
                  const edgeResult = this.markEdge(cell.bottomRightCorner.bottomEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                }
              }

              if ((cell.topEdge.value === '-' && cell.rightEdge.value === 'x') || (cell.topEdge.value === 'x' && cell.rightEdge.value === '-')) {
                if (!cell.bottomLeftCorner.bottomEdge || cell.bottomLeftCorner.bottomEdge.value === 'x') {
                  const edgeResult = this.markEdge(cell.bottomLeftCorner.leftEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                } else if (!cell.bottomLeftCorner.leftEdge || cell.bottomLeftCorner.leftEdge?.value === 'x') {
                  const edgeResult = this.markEdge(cell.bottomLeftCorner.bottomEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                }
              }

              if ((cell.bottomEdge.value === '-' && cell.leftEdge.value === 'x') || (cell.bottomEdge.value === 'x' && cell.leftEdge.value === '-')) {
                if (!cell.topRightCorner.topEdge || cell.topRightCorner.topEdge.value === 'x') {
                  const edgeResult = this.markEdge(cell.topRightCorner.rightEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                } else if (!cell.topRightCorner.rightEdge || cell.topRightCorner.rightEdge?.value === 'x') {
                  const edgeResult = this.markEdge(cell.topRightCorner.topEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                }
              }

              if ((cell.bottomEdge.value === '-' && cell.rightEdge.value === 'x') || (cell.bottomEdge.value === 'x' && cell.rightEdge.value === '-')) {
                if (!cell.topLeftCorner.topEdge || cell.topLeftCorner.topEdge.value === 'x') {
                  const edgeResult = this.markEdge(cell.topLeftCorner.leftEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                } else if (!cell.topLeftCorner.leftEdge || cell.topLeftCorner.leftEdge?.value === 'x') {
                  const edgeResult = this.markEdge(cell.topLeftCorner.topEdge, '-');
                  modified ||= edgeResult.isModified;
                  conflict ||= edgeResult.isConflict;
                }
              }
            }

            // diagonally adjacent 2's with angled line at end of series
            // edges will propagate down in this loop but we have to backtrack for the up cases to avoid multiple loop iterations to set them
            if (cell.topLeftCorner.topEdge?.value === '-' && cell.topLeftCorner.leftEdge?.value === '-') {
              const edgeResult = this.markEdges([cell.bottomEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.topRightCorner.topEdge?.value === '-' && cell.topRightCorner.rightEdge?.value === '-') {
              const edgeResult = this.markEdges([cell.bottomEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.bottomLeftCorner.bottomEdge?.value === '-' && cell.bottomLeftCorner.leftEdge?.value === '-') {
              let tempCell: Cell | null = cell;

              while (tempCell?.value === '2') {
                const edgeResult = this.markEdges([tempCell.topEdge, tempCell.rightEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                tempCell = tempCell.topRightCell;
              }
            }

            if (cell.bottomRightCorner.bottomEdge?.value === '-' && cell.bottomRightCorner.rightEdge?.value === '-') {
              let tempCell: Cell | null = cell;

              while (tempCell?.value === '2') {
                const edgeResult = this.markEdges([tempCell.topEdge, tempCell.leftEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
                tempCell = tempCell.topLeftCell;
              }
            }

            // diagonally adjacent 2's ending with a 3 with incoming line at first 2
            if (cell.topLeftCorner.topEdge?.value === '-' || cell.topLeftCorner.leftEdge?.value === '-') {
              let tempCell: Cell | null = cell;

              while (tempCell?.value === '2') {
                tempCell = tempCell.bottomRightCell;
              }

              if (tempCell?.value === '3') {
                const edgeResult = this.markEdges([tempCell.bottomEdge, tempCell.rightEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.topRightCorner.topEdge?.value === '-' || cell.topRightCorner.rightEdge?.value === '-') {
              let tempCell: Cell | null = cell;

              while (tempCell?.value === '2') {
                tempCell = tempCell.bottomLeftCell;
              }

              if (tempCell?.value === '3') {
                const edgeResult = this.markEdges([tempCell.bottomEdge, tempCell.leftEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomLeftCorner.bottomEdge?.value === '-' || cell.bottomLeftCorner.leftEdge?.value === '-') {
              let tempCell: Cell | null = cell;

              while (tempCell?.value === '2') {
                tempCell = tempCell.topRightCell;
              }

              if (tempCell?.value === '3') {
                const edgeResult = this.markEdges([tempCell.topEdge, tempCell.rightEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomRightCorner.bottomEdge?.value === '-' || cell.bottomRightCorner.rightEdge?.value === '-') {
              let tempCell: Cell | null = cell;

              while (tempCell?.value === '2') {
                tempCell = tempCell.topLeftCell;
              }

              if (tempCell?.value === '3') {
                const edgeResult = this.markEdges([tempCell.topEdge, tempCell.leftEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            // diagonally adjacent 2's ending with 1 or 2 with line approaching 2
            if ((cell.topLeftCorner.topEdge?.value === '-' && (!cell.topLeftCorner.leftEdge || cell.topLeftCorner.leftEdge.value === 'x')) ||
              (cell.topLeftCorner.leftEdge?.value === '-' && (!cell.topLeftCorner.topEdge || cell.topLeftCorner.topEdge.value === 'x'))
            ) {
              let tempCell: Cell | null = cell;

              while (tempCell?.bottomRightCell?.value === '2') {
                tempCell = tempCell.bottomRightCell;
              }

              if (tempCell.bottomRightCell?.value === '1') {
                const edgeResult = this.markEdges([tempCell.bottomRightCell.bottomEdge, tempCell.bottomRightCell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.bottomRightCorner.rightEdge || tempCell.bottomRightCorner.rightEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.bottomRightCorner.bottomEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.bottomRightCorner.bottomEdge || tempCell.bottomRightCorner.bottomEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.bottomRightCorner.rightEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.bottomRightCorner.rightEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.bottomRightCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.bottomRightCorner.bottomEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.bottomRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if ((cell.topRightCorner.topEdge?.value === '-' && (!cell.topRightCorner.rightEdge || cell.topRightCorner.rightEdge.value === 'x')) ||
              (cell.topRightCorner.rightEdge?.value === '-' && (!cell.topRightCorner.topEdge || cell.topRightCorner.topEdge.value === 'x'))
            ) {
              let tempCell: Cell | null = cell;

              while (tempCell?.bottomLeftCell?.value === '2') {
                tempCell = tempCell.bottomLeftCell;
              }

              if (tempCell.bottomLeftCell?.value === '1') {
                const edgeResult = this.markEdges([tempCell.bottomLeftCell.bottomEdge, tempCell.bottomLeftCell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.bottomLeftCorner.leftEdge || tempCell.bottomLeftCorner.leftEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.bottomLeftCorner.bottomEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.bottomLeftCorner.bottomEdge || tempCell.bottomLeftCorner.bottomEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.bottomLeftCorner.leftEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.bottomLeftCorner.leftEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.bottomLeftCorner.bottomEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.bottomLeftCorner.bottomEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.bottomLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if ((cell.bottomLeftCorner.bottomEdge?.value === '-' && (!cell.bottomLeftCorner.leftEdge || cell.bottomLeftCorner.leftEdge.value === 'x')) ||
              (cell.bottomLeftCorner.leftEdge?.value === '-' && (!cell.bottomLeftCorner.bottomEdge || cell.bottomLeftCorner.bottomEdge.value === 'x'))
            ) {
              let tempCell: Cell | null = cell;

              while (tempCell?.topRightCell?.value === '2') {
                tempCell = tempCell.topRightCell;
              }

              if (tempCell.topRightCell?.value === '1') {
                const edgeResult = this.markEdges([tempCell.topRightCell.topEdge, tempCell.topRightCell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.topRightCorner.rightEdge || tempCell.topRightCorner.rightEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.topRightCorner.topEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.topRightCorner.topEdge || tempCell.topRightCorner.topEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.topRightCorner.rightEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.topRightCorner.rightEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.topRightCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.topRightCorner.topEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.topRightCorner.rightEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if ((cell.bottomRightCorner.bottomEdge?.value === '-' && (!cell.bottomRightCorner.rightEdge || cell.bottomRightCorner.rightEdge.value === 'x')) ||
              (cell.bottomRightCorner.rightEdge?.value === '-' && (!cell.bottomRightCorner.bottomEdge || cell.bottomRightCorner.bottomEdge.value === 'x'))
            ) {
              let tempCell: Cell | null = cell;

              while (tempCell?.topLeftCell?.value === '2') {
                tempCell = tempCell.topLeftCell;
              }

              if (tempCell.topLeftCell?.value === '1') {
                const edgeResult = this.markEdges([tempCell.topLeftCell.topEdge, tempCell.topLeftCell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.topLeftCorner.leftEdge || tempCell.topLeftCorner.leftEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.topLeftCorner.topEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (!tempCell.topLeftCorner.topEdge || tempCell.topLeftCorner.topEdge.value === 'x') {
                const edgeResult = this.markEdge(tempCell.topLeftCorner.leftEdge, '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.topLeftCorner.leftEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.topLeftCorner.topEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (tempCell.topLeftCorner.topEdge.value === '-') {
                const edgeResult = this.markEdge(tempCell.topLeftCorner.leftEdge, 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            // check cell count
            if (cell.includedEdges.length > 2 || cell.excludedEdges.length > 2) {
              if (this.debugLevel > 0) {
                console.log(`Cell value conflict for cell {${cell.row}, ${cell.col}}`);
              }
              return false;
            }
          } else if (cell.value === '3') {
            if (cell.includedEdges.length === 3) {
              const edgeResult = this.markEdges(cell.unmarkedEdges, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            } else if (cell.excludedEdges.length === 1) {
              const edgeResult = this.markEdges(cell.unmarkedEdges, '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            // 3 with two deleted edges exiting a corner
            if ((!cell.topLeftCorner.topEdge || cell.topLeftCorner.topEdge.value === 'x') &&
              (!cell.topLeftCorner.leftEdge || cell.topLeftCorner.leftEdge.value === 'x')
            ) {
              const edgeResult = this.markEdges([cell.topEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if ((!cell.topRightCorner.topEdge || cell.topRightCorner.topEdge.value === 'x') &&
              (!cell.topRightCorner.rightEdge || cell.topRightCorner.rightEdge.value === 'x')
            ) {
              const edgeResult = this.markEdges([cell.topEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if ((!cell.bottomLeftCorner.bottomEdge || cell.bottomLeftCorner.bottomEdge.value === 'x') &&
              (!cell.bottomLeftCorner.leftEdge || cell.bottomLeftCorner.leftEdge.value === 'x')
            ) {
              const edgeResult = this.markEdges([cell.bottomEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if ((!cell.bottomRightCorner.bottomEdge || cell.bottomRightCorner.bottomEdge.value === 'x') &&
              (!cell.bottomRightCorner.rightEdge || cell.bottomRightCorner.rightEdge.value === 'x')
            ) {
              const edgeResult = this.markEdges([cell.bottomEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            // 3 with incoming line
            if (cell.topLeftCorner.topEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.bottomEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.topLeftCorner.leftEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.topLeftCorner.leftEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.bottomEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.topLeftCorner.topEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.topRightCorner.topEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.bottomEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.topRightCorner.rightEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.topRightCorner.rightEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.bottomEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.topRightCorner.topEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.bottomLeftCorner.bottomEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.topEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.bottomLeftCorner.leftEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.bottomLeftCorner.leftEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.topEdge, cell.rightEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.bottomLeftCorner.bottomEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.bottomRightCorner.bottomEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.topEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.bottomRightCorner.rightEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            if (cell.bottomRightCorner.rightEdge?.value === '-') {
              let edgeResult = this.markEdges([cell.topEdge, cell.leftEdge], '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
              edgeResult = this.markEdge(cell.bottomRightCorner.bottomEdge, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }

            // diagonals of 3 and 1
            if (cell.topLeftCell?.value === '1') {
              if (cell.topLeftCell.topEdge.value === 'x' && cell.topLeftCell.leftEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomEdge, cell.rightEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.bottomEdge.value === '-' && cell.rightEdge.value === '-') {
                const edgeResult = this.markEdges([cell.topLeftCell.topEdge, cell.topLeftCell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.topRightCell?.value === '1') {
              if (cell.topRightCell.topEdge.value === 'x' && cell.topRightCell.rightEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.bottomEdge, cell.leftEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.bottomEdge.value === '-' && cell.leftEdge.value === '-') {
                const edgeResult = this.markEdges([cell.topRightCell.topEdge, cell.topRightCell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomLeftCell?.value === '1') {
              if (cell.bottomLeftCell.bottomEdge.value === 'x' && cell.bottomLeftCell.leftEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.topEdge, cell.rightEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.topEdge.value === '-' && cell.rightEdge.value === '-') {
                const edgeResult = this.markEdges([cell.bottomLeftCell.bottomEdge, cell.bottomLeftCell.leftEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            if (cell.bottomRightCell?.value === '1') {
              if (cell.bottomRightCell.bottomEdge.value === 'x' && cell.bottomRightCell.rightEdge.value === 'x') {
                const edgeResult = this.markEdges([cell.topEdge, cell.leftEdge], '-');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              } else if (cell.topEdge.value === '-' && cell.leftEdge.value === '-') {
                const edgeResult = this.markEdges([cell.bottomRightCell.bottomEdge, cell.bottomRightCell.rightEdge], 'x');
                modified ||= edgeResult.isModified;
                conflict ||= edgeResult.isConflict;
              }
            }

            // check cell count
            if (cell.includedEdges.length > 3 || cell.excludedEdges.length > 1) {
              if (this.debugLevel > 0) {
                console.log(`Cell value conflict for cell {${cell.row}, ${cell.col}}`);
              }
              return false;
            }
          }
        }
      }

      // every corner must have exactly 0 or 2 connected edges
      for (const cornerRow of this.corners) {
        for (const corner of cornerRow) {
          if (corner.isCornerCorner) {
            // outer corners
            if (corner.excludedEdges.length === 1) {
              const edgeResult = this.markEdges(corner.nonExcludedEdges, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            } else if (corner.includedEdges.length === 1) {
              const edgeResult = this.markEdges(corner.nonIncludedEdges, '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }
          } else if (corner.isEdgeCorner) {
            // edge corners
            if (corner.excludedEdges.length === 2) {
              const edgeResult = this.markEdges(corner.nonExcludedEdges, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            } else if (corner.includedEdges.length === 1 && corner.excludedEdges.length === 1) {
              const edgeResult = this.markEdges(corner.unmarkedEdges, '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }
          } else {
            // inner corners
            if (corner.excludedEdges.length === 3) {
              const edgeResult = this.markEdges(corner.nonExcludedEdges, 'x');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            } else if (corner.includedEdges.length === 1 && corner.excludedEdges.length === 2) {
              const edgeResult = this.markEdges(corner.unmarkedEdges, '-');
              modified ||= edgeResult.isModified;
              conflict ||= edgeResult.isConflict;
            }
          }

          // all corners
          if (corner.includedEdges.length === 2) {
            const edgeResult = this.markEdges(corner.nonIncludedEdges, 'x');
            modified ||= edgeResult.isModified;
            conflict ||= edgeResult.isConflict;
          }
        }
      }

      if (this.debugLevel > 1) {
        console.log(`After solve loop iteration ${iteration}:\n` + this.prettyPrint());
      }

      if (conflict) {
        return false;
      }
    }

    return true;
  }

  private markEdges(edges: (VEdge | HEdge | null | undefined)[], value: string): IMarkEdgeResult {
    let modified = false;
    let conflict = false;

    for (const edge of edges) {
      const edgeResult = this.markEdge(edge, value);
      modified ||= edgeResult.isModified;
      conflict ||= edgeResult.isConflict;
    }

    return { isModified: modified, isConflict: conflict };
  }

  markEdge(edge: VEdge | HEdge | null | undefined, value: string): IMarkEdgeResult {
    if (edge === null || edge === undefined) {
      return { isModified: false, isConflict: false };
    } else {
      return this.markEdgeEdgeCounts(edge, value);
    }
  }

  private markEdgeNoCounts(edge: VEdge | HEdge | null | undefined, value: string): IMarkEdgeResult {
    if (edge) {
      if (edge.value === value) {
        return { isModified: false, isConflict: false };
      } else if (edge.value === '') {
        edge.value = value;
        return { isModified: true, isConflict: false };
      } else {
        return { isModified: false, isConflict: true };
      }
    } else {
      return { isModified: false, isConflict: false };
    }
  }

  private runOneTimeSolvePassEdgeCounts() {
    // set cell possible edge counts based on cell values
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        switch (cell.value) {
          case '0':
            this.applyCellValueRule(cell, [1, 2]);
            break;
          case '1':
            this.applyCellValueRule(cell, [2]);
            break;
          case '3':
            this.applyCellValueRule(cell, [0]);
            break;
        }
      }
    }

    // remove 2 from outer corner edge counts
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

    // remove 1 from outer board corners
    this.corners[0][0].topLeftEdgeCount.delete(1);
    this.corners[0][this.columns].topRightEdgeCount.delete(1);
    this.corners[this.rows][0].bottomLeftEdgeCount.delete(1);
    this.corners[this.rows][this.columns].bottomRightEdgeCount.delete(1);

    // special case of adjacent 1 cells on outer edge
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        if ((cell.row === 0 || cell.row === this.rows - 1) && cell.value === '1' && cell.rightCell?.value === '1') {
          this.markEdgeEdgeCounts(cell.rightEdge, 'x');
        }

        if ((cell.col === 0 || cell.col === this.columns - 1) && cell.value === '1' && cell.bottomCell?.value === '1') {
          this.markEdgeEdgeCounts(cell.bottomEdge, 'x');
        }
      }
    }

    // special case of adjacent 3 cells
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        if (cell.value === '3' && cell.rightCell?.value === '3') {
          this.markEdgeEdgeCounts(cell.leftEdge, '-');
          this.markEdgeEdgeCounts(cell.rightEdge, '-');
          this.markEdgeEdgeCounts(cell.rightCell.rightEdge, '-');
          if (cell.topCell) {
            this.markEdgeEdgeCounts(cell.topCell.rightEdge, 'x');
          }
          if (cell.bottomCell) {
            this.markEdgeEdgeCounts(cell.bottomCell.rightEdge, 'x');
          }
        }

        if (cell.value === '3' && cell.bottomCell?.value === '3') {
          this.markEdgeEdgeCounts(cell.topEdge, '-');
          this.markEdgeEdgeCounts(cell.bottomEdge, '-');
          this.markEdgeEdgeCounts(cell.bottomCell.bottomEdge, '-');
          if (cell.leftCell) {
            this.markEdgeEdgeCounts(cell.leftCell.bottomEdge, 'x');
          }
          if (cell.rightCell) {
            this.markEdgeEdgeCounts(cell.rightCell.bottomEdge, 'x');
          }
        }
      }
    }

    if (this.debugLevel > 0) {
      this.prettyPrint();
    }
  }

  // returns false if any conflicts occur
  private runSolveLoopEdgeCounts(): boolean {
    let modified = true;
    let iteration = 0;

    while (modified) {
      modified = false;
      iteration++;

      // apply deductions based on cell value and possible edge counts
      for (const cellRow of this.cells) {
        for (const cell of cellRow) {
          switch (cell.value) {
            case '1':
              modified = this.applyEdgeCountRule(cell, [0], [0]) || modified;
              modified = this.applyEdgeCountRule(cell, [1], [1]) || modified;
              break;
            case '2':
              modified = this.applyEdgeCountRule(cell, [0], [0, 1], [0, 2]) || modified;
              modified = this.applyEdgeCountRule(cell, [1], [0, 2]) || modified;
              modified = this.applyEdgeCountRule(cell, [2], [1, 2], [0, 2]) || modified;
              modified = this.applyEdgeCountRule(cell, [0, 1], [0]) || modified;
              modified = this.applyEdgeCountRule(cell, [1, 2], [2]) || modified;
              modified = this.applyEdgeCountRule(cell, [0, 2], [1], [0, 2]) || modified;
              break;
            case '3':
              modified = this.applyEdgeCountRule(cell, [1], [1]) || modified;
              modified = this.applyEdgeCountRule(cell, [2], [2]) || modified;
              break;
          }
        }
      }

      // apply deductions based on corner edge counts
      for (const cornerRow of this.corners) {
        for (const corner of cornerRow) {
          modified = this.applyEdgeCountRule(corner, [0], [1], [2]) || modified;
          modified = this.applyEdgeCountRule(corner, [1], [0, 2]) || modified;
          modified = this.applyEdgeCountRule(corner, [2], [1, 2], [0, 2]) || modified;
          modified = this.applyEdgeCountRule(corner, [1, 2], [2]) || modified;
          modified = this.applyEdgeCountRule(corner, [0, 2], [1], [2]) || modified;

          // if any edge counts are empty, we have an unsolvable board
          if (corner.topLeftEdgeCount.size === 0 ||
            corner.topRightEdgeCount.size === 0 ||
            corner.bottomLeftEdgeCount.size === 0 ||
            corner.bottomRightEdgeCount.size === 0
          ) {
            if (this.debugLevel > 0) {
              console.log('Unsolvable due to empty edge count');
            }
            return false;
          }
        }
      }

      // mark excluded and included edges and update adjacent edge counts
      let conflict = false;

      for (const cellRow of this.cells) {
        for (const cell of cellRow) {
          let edgeResult = this.updateEdgesEdgeCounts(cell, cell.topLeftCorner);
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
          edgeResult = this.updateEdgesEdgeCounts(cell, cell.topRightCorner);
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
          edgeResult = this.updateEdgesEdgeCounts(cell, cell.bottomLeftCorner);
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
          edgeResult = this.updateEdgesEdgeCounts(cell, cell.bottomRightCorner);
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
        }
      }

      if (this.debugLevel > 1) {
        console.log(`After solve loop iteration ${iteration}:\n` + this.prettyPrint());
      }

      if (conflict) {
        return false;
      }
    }

    if (this.debugLevel > 0) {
      console.log(`Solve loop completed after ${iteration} iterations`);
    }

    return true;
  }

  // returns true if any edge is modified
  private updateEdgesEdgeCounts(
    cell: Cell,
    corner: Corner,
  ): IMarkEdgeResult {
    let modified = false;
    let conflict = false;
    let cornerCount: Set<number>;
    let adjacentVEdge: VEdge;
    let adjacentHEdge: HEdge;
    let adjacentVEdgeCornerCount: Set<number>;
    let adjacentHEdgeCornerCount: Set<number>;

    if (corner === cell.topLeftCorner) {
      cornerCount = cell.topLeftEdgeCount;
      adjacentVEdge = cell.topEdge;
      adjacentHEdge = cell.leftEdge;
      adjacentVEdgeCornerCount = cell.topLeftCorner.topRightEdgeCount;
      adjacentHEdgeCornerCount = cell.topLeftCorner.bottomLeftEdgeCount;
    } else if (corner === cell.topRightCorner) {
      cornerCount = cell.topRightEdgeCount;
      adjacentVEdge = cell.topEdge;
      adjacentHEdge = cell.rightEdge;
      adjacentVEdgeCornerCount = cell.topRightCorner.topLeftEdgeCount;
      adjacentHEdgeCornerCount = cell.topRightCorner.bottomRightEdgeCount;
    } else if (corner === cell.bottomLeftCorner) {
      cornerCount = cell.bottomLeftEdgeCount;
      adjacentVEdge = cell.bottomEdge;
      adjacentHEdge = cell.leftEdge;
      adjacentVEdgeCornerCount = cell.bottomLeftCorner.bottomRightEdgeCount;
      adjacentHEdgeCornerCount = cell.bottomLeftCorner.topLeftEdgeCount;
    } else {
      cornerCount = cell.bottomRightEdgeCount;
      adjacentVEdge = cell.bottomEdge;
      adjacentHEdge = cell.rightEdge;
      adjacentVEdgeCornerCount = cell.bottomRightCorner.bottomLeftEdgeCount;
      adjacentHEdgeCornerCount = cell.bottomRightCorner.topRightEdgeCount;
    }

    if (cornerCount.size === 1) {
      if (cornerCount.has(0)) {
        let edgeResult = this.markEdgeEdgeCounts(adjacentVEdge, 'x');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
        edgeResult = this.markEdgeEdgeCounts(adjacentHEdge, 'x');
      } else if (cornerCount.has(1)) {
        if (adjacentVEdge.value === '-') {
          const edgeResult = this.markEdgeEdgeCounts(adjacentHEdge, 'x');
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
        }
        if (adjacentVEdge.value === 'x') {
          const edgeResult = this.markEdgeEdgeCounts(adjacentHEdge, '-');
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
        }
        if (adjacentHEdge.value === '-') {
          const edgeResult = this.markEdgeEdgeCounts(adjacentVEdge, 'x');
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
        }
        if (adjacentHEdge.value === 'x') {
          const edgeResult = this.markEdgeEdgeCounts(adjacentVEdge, '-');
          modified ||= edgeResult.isModified;
          conflict ||= edgeResult.isConflict;
        }
      } else if (cornerCount.has(2)) {
        let edgeResult = this.markEdgeEdgeCounts(adjacentVEdge, '-');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
        edgeResult = this.markEdgeEdgeCounts(adjacentHEdge, '-');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
      }
    }

    // handle special case of outer edges
    if (adjacentVEdgeCornerCount.size === 1 && (adjacentVEdge.row === 0 || adjacentVEdge.row === this.rows)) {
      if (adjacentVEdgeCornerCount.has(0)) {
        const edgeResult = this.markEdgeEdgeCounts(adjacentVEdge, 'x');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
      } else if (adjacentVEdgeCornerCount.has(1)) {
        const edgeResult = this.markEdgeEdgeCounts(adjacentVEdge, '-');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
      }
    }

    if (adjacentHEdgeCornerCount.size === 1 && (adjacentHEdge.col === 0 || adjacentHEdge.col === this.columns)) {
      if (adjacentHEdgeCornerCount.has(0)) {
        const edgeResult = this.markEdgeEdgeCounts(adjacentHEdge, 'x');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
      } else if (adjacentHEdgeCornerCount.has(1)) {
        const edgeResult = this.markEdgeEdgeCounts(adjacentHEdge, '-');
        modified ||= edgeResult.isModified;
        conflict ||= edgeResult.isConflict;
      }
    }

    // handle case where both adjacent edges are included or excluded
    if (adjacentVEdge.value === 'x' && adjacentHEdge.value === 'x') {
      modified = cornerCount.delete(1) || modified;
      modified = cornerCount.delete(2) || modified;
    }

    if (adjacentVEdge.value === '-' && adjacentHEdge.value === '-') {
      modified = cornerCount.delete(0) || modified;
      modified = cornerCount.delete(1) || modified;
    }

    return { isModified: modified, isConflict: conflict };
  }

  // returns true if edge was modified
  private markEdgeEdgeCounts(edge: VEdge | HEdge, value: string): IMarkEdgeResult {
    if (edge.value === value) {
      return { isModified: false, isConflict: false };
    } else if (edge.value === '') {
      edge.value = value;

      if (value === 'x') {
        if (edge instanceof VEdge) {
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
      } else if (value === '-') {
        if (edge instanceof VEdge) {
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

      return { isModified: true, isConflict: false };
    } else {
      return { isModified: false, isConflict: true };
    }
  }

  private applyCellValueRule(cell: Cell, removeValues: number[]) {
    removeValues.forEach(value => {
      cell.topLeftEdgeCount.delete(value);
      cell.topRightEdgeCount.delete(value);
      cell.bottomLeftEdgeCount.delete(value);
      cell.bottomRightEdgeCount.delete(value);
    });
  }

  private areEqual(set: Set<number>, array: number[]): boolean {
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
  private applyEdgeCountRule(item: IEdgeCount, edgeCount: number[], removeDiagonal: number[] = [], removeAdjacent: number[] = []): boolean {
    let modified = false;

    if (this.areEqual(item.topLeftEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified = item.bottomRightEdgeCount.delete(value) || modified;
      });
      removeAdjacent.forEach(value => {
        modified = item.bottomLeftEdgeCount.delete(value) || modified;
        modified = item.topRightEdgeCount.delete(value) || modified;
      });
    }
    if (this.areEqual(item.topRightEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified = item.bottomLeftEdgeCount.delete(value) || modified;
      });
      removeAdjacent.forEach(value => {
        modified = item.topLeftEdgeCount.delete(value) || modified;
        modified = item.bottomRightEdgeCount.delete(value) || modified;
      });
    }
    if (this.areEqual(item.bottomLeftEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified = item.topRightEdgeCount.delete(value) || modified;
      });
      removeAdjacent.forEach(value => {
        modified = item.topLeftEdgeCount.delete(value) || modified;
        modified = item.bottomRightEdgeCount.delete(value) || modified;
      });
    }
    if (this.areEqual(item.bottomRightEdgeCount, edgeCount)) {
      removeDiagonal.forEach(value => {
        modified = item.topLeftEdgeCount.delete(value) || modified;
      });
      removeAdjacent.forEach(value => {
        modified = item.bottomLeftEdgeCount.delete(value) || modified;
        modified = item.topRightEdgeCount.delete(value) || modified;
      });
    }

    return modified;
  }

  private cloneSet(source: Set<number>, target: Set<number>) {
    target.clear();
    source.forEach(value => {
      target.add(value);
    });
  }
}

export default SlitherlinkBoard;