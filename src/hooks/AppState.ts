import { useState } from "react";

interface IAppState {
  game: string;
  rows: number;
  columns: number;
  status: string;
  handleStart: (game: string, rows: number, columns: number) => void;
  handleNewGame: () => void;
}

const AppState = (): IAppState => {
  const [game, setGame] = useState("");
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const [status, setStatus] = useState("new");

  const handleStart = (game: string, rows: number, columns: number) => {
    setGame(game);
    setRows(rows);
    setColumns(columns);
    setStatus("started");
  };

  const handleNewGame = () => {
    if (window.confirm("Are you sure you want to start a new game?")) {
      setStatus("new");
    }
  }

  return { game, rows, columns, status, handleStart, handleNewGame };
};

export default AppState;