import { Cell } from './Cell';
import { Corner } from './Corner';
import { VEdge } from './VEdge';
import { HEdge } from './HEdge';
import { MultipleSolutionsError } from './MultipleSolutionsError';
import { NoSolutionError } from './NoSolutionError';
import { IRecursiveSolveResult } from './IRecursiveSolveResult';
import { ISolvedCheckResult } from './ISolvedCheckResult';
import { IMarkEdgeResult } from './IMarkEdgeResult';
import { MaxSolveDepthExceededError } from './MaxSolveDepthExceededError';

export class SlitherlinkBoard {
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
      });
    });

    return clone;
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

  prettyPrint(): string {
    let output = '';
    let row1: string;
    let row2: string;

    this.cells.forEach((cellRow, rowIndex) => {
      row1 = '■';

      switch (cellRow[0].leftEdge.value) {
        case '':
          row2 = ' ';
          break;
        case '-':
          row2 = '|';
          break;
        case 'x':
          row2 = 'x';
          break;
      }

      cellRow.forEach((cell, colIndex) => {
        switch (cell.topEdge.value) {
          case '':
            row1 += '   ';
            break;
          case '-':
            row1 += '---';
            break;
          case 'x':
            row1 += ' x ';
            break;
        }

        row1 += '■';
        row2 += cell.value.padStart(2);

        switch (cell.rightEdge.value) {
          case '':
            row2 += '  ';
            break;
          case '-':
            row2 += ' |';
            break;
          case 'x':
            row2 += ' x';
            break;
        }
      });

      output += [row1, row2].join('\n') + '\n';
    });

    row1 = '■';
    this.cells[this.rows - 1].forEach((cell, colIndex) => {
      switch (cell.bottomEdge.value) {
        case '':
          row1 += '   ';
          break;
        case '-':
          row1 += '---';
          break;
        case 'x':
          row1 += ' x ';
          break;
      }

      row1 += '■';
    });

    output += row1 + '\n';
    const diffOutput = this.diff(output, this.prevDebugOutput);
    this.prevDebugOutput = output;
    return diffOutput;
  }

  solve(maxDepth = 0, maxIterations = 0) {
    this.resetBoard();

    if (this.debugLevel > 1) {
      console.log('Initial state:\n' + this.prettyPrint());
    }

    this.runOneTimeSolvePass();

    const result = this.recursiveSolve(1, maxDepth, maxIterations);

    if (result.solutions === 0) {
      throw new NoSolutionError();
    } else {
      this.apply(result.board);
    }

    this.removeDeletedEdges();
  }

  private recursiveSolve(depth = 1, maxDepth = 0, maxIterations = 0): IRecursiveSolveResult {
    if (this.debugLevel > 0) {
      console.log(`Recursive solve depth ${depth}`);
    }

    if (maxDepth > 0 && depth > maxDepth) {
      throw new MaxSolveDepthExceededError();
    }

    if (!this.runSolveLoop(maxIterations)) {
      if (this.debugLevel > 0) {
        console.log(`No solution found: conflict detected`);
      }
      return { board: this, solutions: 0 };
    }

    const solvedResult = this.runSolvedCheck();

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

      const setResult = clone.recursiveSolve(depth + 1, maxDepth);

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

      const unsetResult = clone.recursiveSolve(depth + 1, maxDepth);

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

    const edgeMap = new Map();

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
        edgeMap.set(curEdge, null);
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
  runSolveLoop(maxIterations = 0): boolean {
    let modified = true;
    let iteration = 0;

    while (modified) {
      modified = false;
      iteration++;
      let conflict = false;

      if (maxIterations > 0 && iteration > maxIterations) {
        if (this.debugLevel > 0) {
          console.log('Exiting solve loop due to max iterations');
        }
        break;
      }

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

  private markEdge(edge: VEdge | HEdge | null | undefined, value: string): IMarkEdgeResult {
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
}