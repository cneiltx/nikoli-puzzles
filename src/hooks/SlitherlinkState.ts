import { useState } from "react";
import SlitherlinkBoard from "../model/SlitherlinkBoard";

interface ISlitherlinkState {
  board: SlitherlinkBoard;
  status: string;
  dialog: string;
  handleHEdgeClick: (row: number, col: number) => void;
  handleHEdgeRightClick: (row: number, col: number) => void;
  handleVEdgeClick: (row: number, col: number) => void;
  handleVEdgeRightClick: (row: number, col: number) => void;
  handleReset: () => void;
  handleResetConfirm: (button: string) => void;
  handleSolve: () => void;
  handleSolveConfirm: (button: string) => void;
  handleSolvedConfirm: (button: string) => void;
}

const SlitherlinkState = (rows: number, columns: number): ISlitherlinkState => {
  const [board, setBoard] = useState(new SlitherlinkBoard(rows, columns));
  const [status, setStatus] = useState("playing");
  const [dialog, setDialog] = useState("");

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

  const handleReset = () => {
    setDialog("reset");
  };

  const handleResetConfirm = (button: string) => {
    if (button === "OK") {
      let copy = Object.create(board);
      copy.reset();
      setBoard(copy);
      setStatus("playing");
    }
    setDialog("");
  }

  const handleSolve = () => {
    setDialog("solve");
  };

  const handleSolveConfirm = (button: string) => {
    if (button === "OK") {
      let copy = Object.create(board);
      copy.solve();
      setBoard(copy);
      setStatus("solved");
    }
    setDialog("");
  }

  const checkIfSolved = () => {
    if (board.isSolved()) {
      setDialog("solved");
      setStatus("solved");
    }
  };

  const handleSolvedConfirm = (button: string) => {
    setDialog("");
  }

  return {
    board,
    status,
    dialog,
    handleHEdgeClick,
    handleHEdgeRightClick,
    handleVEdgeClick,
    handleVEdgeRightClick,
    handleReset,
    handleResetConfirm,
    handleSolve,
    handleSolveConfirm,
    handleSolvedConfirm
  };
}

export default SlitherlinkState;