import { Cell } from "./Cell";
import { MaxSolveDepthExceededError } from "./MaxSolveDepthExceededError";
import { MultipleSolutionsError } from "./MultipleSolutionsError";
import { SlitherlinkBoard } from "./SlitherlinkBoard";

export class SlitherlinkGenerator {
  generateBoard(rows: number, columns: number): SlitherlinkBoard {
    const board = new SlitherlinkBoard(new Array(rows).fill('').map(() => new Array(columns).fill('')));
    this.generatePath(board);
    this.removeNumbers(board);
    return board;
  }

  private generatePath(board: SlitherlinkBoard) {
    const availableCells = board.cells.flat();
    const expandableCells: Cell[] = [];
    const unexpandableCells: Cell[] = [];

    let curIndex = this.getRandomIndex(availableCells);
    expandableCells.push(availableCells[curIndex]);
    availableCells.splice(curIndex, 1);

    while (expandableCells.length > 0) {
      curIndex = this.getRandomIndex(expandableCells);
      let cell = expandableCells[curIndex];
      let validNeighbours = [];

      if (cell.topCell &&
        this.contains(availableCells, cell.topCell) &&
        (!cell.topCell.topCell || this.contains(availableCells, cell.topCell.topCell)) &&
        (!cell.topCell.topLeftCell || this.contains(availableCells, cell.topCell.topLeftCell)) &&
        (!cell.topCell.topRightCell || this.contains(availableCells, cell.topCell.topRightCell))
      ) {
        validNeighbours.push(cell.topCell);

        if (this.contains(availableCells, cell.topCell.leftCell) && this.contains(availableCells, cell.topCell.rightCell)) {
          validNeighbours.push(cell.topCell, cell.topCell);
        }
      }

      if (cell.bottomCell &&
        this.contains(availableCells, cell.bottomCell) &&
        (!cell.bottomCell.bottomCell || this.contains(availableCells, cell.bottomCell.bottomCell)) &&
        (!cell.bottomCell.bottomLeftCell || this.contains(availableCells, cell.bottomCell.bottomLeftCell)) &&
        (!cell.bottomCell.bottomRightCell || this.contains(availableCells, cell.bottomCell.bottomRightCell)) &&
        (!cell.bottomCell.leftCell || this.contains(availableCells, cell.bottomCell.leftCell)) &&
        (!cell.bottomCell.rightCell || this.contains(availableCells, cell.bottomCell.rightCell))
      ) {
        validNeighbours.push(cell.bottomCell);

        if (this.contains(availableCells, cell.bottomCell.leftCell) && this.contains(availableCells, cell.bottomCell.rightCell)) {
          validNeighbours.push(cell.bottomCell, cell.bottomCell);
        }
      }

      if (cell.leftCell &&
        this.contains(availableCells, cell.leftCell) &&
        (!cell.leftCell.leftCell || this.contains(availableCells, cell.leftCell.leftCell)) &&
        (!cell.leftCell.topLeftCell || this.contains(availableCells, cell.leftCell.topLeftCell)) &&
        (!cell.leftCell.bottomLeftCell || this.contains(availableCells, cell.leftCell.bottomLeftCell)) &&
        (!cell.leftCell.topCell || this.contains(availableCells, cell.leftCell.topCell)) &&
        (!cell.leftCell.bottomCell || this.contains(availableCells, cell.leftCell.bottomCell))
      ) {
        validNeighbours.push(cell.leftCell);

        if (this.contains(availableCells, cell.leftCell.topCell) && this.contains(availableCells, cell.leftCell.bottomCell)) {
          validNeighbours.push(cell.leftCell, cell.leftCell);
        }
      }

      if (cell.rightCell &&
        this.contains(availableCells, cell.rightCell) &&
        (!cell.rightCell.rightCell || this.contains(availableCells, cell.rightCell.rightCell)) &&
        (!cell.rightCell.topRightCell || this.contains(availableCells, cell.rightCell.topRightCell)) &&
        (!cell.rightCell.bottomRightCell || this.contains(availableCells, cell.rightCell.bottomRightCell)) &&
        (!cell.rightCell.topCell || this.contains(availableCells, cell.rightCell.topCell)) &&
        (!cell.rightCell.bottomCell || this.contains(availableCells, cell.rightCell.bottomCell))
      ) {
        validNeighbours.push(cell.rightCell);

        if (this.contains(availableCells, cell.rightCell.topCell) && this.contains(availableCells, cell.rightCell.bottomCell)) {
          validNeighbours.push(cell.rightCell, cell.rightCell);
        }
      }

      if (validNeighbours.length === 0 || (validNeighbours.length === 1 && Math.random() < .5)) {
        unexpandableCells.push(cell);
        expandableCells.splice(curIndex, 1);
      } else {
        const neighbourIndex = this.getRandomIndex(validNeighbours);
        expandableCells.push(validNeighbours[neighbourIndex]);
        this.remove(availableCells, validNeighbours[neighbourIndex]);
      }
    }

    unexpandableCells.map(cell => cell.value = String(4 - cell.adjacentCells.filter(cell => this.contains(unexpandableCells, cell)).length));
    availableCells.map(cell => cell.value = String(cell.adjacentCells.filter(cell => this.contains(unexpandableCells, cell)).length));
  }

  private getRandomIndex(array: Array<Cell>): number {
    return Math.floor(Math.random() * array.length);
  }

  private contains(array: Array<Cell>, value: Cell | null): boolean {
    return value !== null && array.indexOf(value) >= 0;
  }

  private remove(array: Array<Cell>, value: Cell | null): boolean {
    const index = value === null ? -1 : array.indexOf(value);

    if (index >= 0) {
      array.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  private removeNumbers(board: SlitherlinkBoard) {
    const eligibleCells = board.cells.flat();

    while (eligibleCells.length > 0) {
      const curIndex = this.getRandomIndex(eligibleCells);
      const cell = eligibleCells[curIndex];
      eligibleCells.splice(curIndex, 1);
      const cellValue = cell.value;
      board.cells[cell.row][cell.col].value = '';

      try {
        board.solve(1); // TODO: Tie recursion depth to difficulty
      } catch (e) {
        if (e instanceof MultipleSolutionsError || e instanceof MaxSolveDepthExceededError) {
          board.cells[cell.row][cell.col].value = cellValue;
        } else {
          console.error(e);
        }
      }
    }

    board.resetBoard();
  }
}