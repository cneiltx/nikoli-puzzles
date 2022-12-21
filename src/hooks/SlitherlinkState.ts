import { useState } from "react";
import SlitherlinkBoard from "../model/SlitherlinkBoard";

interface ISlitherlinkState {
  board: SlitherlinkBoard;
  handleHEdgeClick: (row: number, col: number) => void;
  handleHEdgeRightClick: (row: number, col: number) => void;
  handleVEdgeClick: (row: number, col: number) => void;
  handleVEdgeRightClick: (row: number, col: number) => void;
  handleReset: () => void;
  handleSolve: () => void;
}

const SlitherlinkState = (rows: number, columns: number): ISlitherlinkState => {
  const [board, setBoard] = useState(new SlitherlinkBoard(rows, columns));

  const handleHEdgeClick = (row: number, col: number) => {
    let copy = Object.create(board);
    copy.hEdges[row][col].value = (copy.hEdges[row][col].value === "-" ? "" : "-");
    setBoard(copy);
    checkIfSolved();
  };

  const handleHEdgeRightClick = (row: number, col: number) => {
    let copy = Object.create(board);
    copy.hEdges[row][col].value = (copy.hEdges[row][col].value === "x" ? "" : "x");
    setBoard(copy);
  }

  const handleVEdgeClick = (row: number, col: number) => {
    let copy = Object.create(board);
    copy.vEdges[row][col].value = (copy.vEdges[row][col].value === "-" ? "" : "-");
    setBoard(copy);
    checkIfSolved();
  };

  const handleVEdgeRightClick = (row: number, col: number) => {
    let copy = Object.create(board);
    copy.vEdges[row][col].value = (copy.vEdges[row][col].value === "x" ? "" : "x");
    setBoard(copy);
  }

  const checkIfSolved = () => {
    if (board.isSolved()) {
      window.alert("solved!");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset this game?")) {
      setBoard(new SlitherlinkBoard(rows, columns));
    }
  };

  const handleSolve = () => {
    if (window.confirm("Are you sure you want to solve this game?")) {
      // TODO: Solve it
    }
  };

  return { board, handleHEdgeClick, handleHEdgeRightClick, handleVEdgeClick, handleVEdgeRightClick, handleReset, handleSolve };
}

export default SlitherlinkState;