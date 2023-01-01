import { useState } from 'react';

interface IAppState {
  game: string;
  rows: number;
  columns: number;
  status: string;
  dialog: string;
  handleStart: (game: string, rows: number, columns: number) => void;
  handleNewGame: () => void;
  handleNewGameConfirm: (button: string) => void;
}

const AppState = (): IAppState => {
  const [game, setGame] = useState('');
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const [status, setStatus] = useState('new');
  const [dialog, setDialog] = useState('');

  const handleStart = (game: string, rows: number, columns: number) => {
    setGame(game);
    setRows(rows);
    setColumns(columns);
    setStatus('started');
  };

  const handleNewGame = () => {
    setDialog('newGame');
  }

  const handleNewGameConfirm = (button: string) => {
    if (button === 'OK') {
      setStatus('new');
    }
    setDialog('');
  }

  return { game, rows, columns, status, dialog, handleStart, handleNewGame, handleNewGameConfirm };
};

export default AppState;