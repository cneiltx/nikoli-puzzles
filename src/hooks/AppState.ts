import { useEffect, useState } from 'react';
import { IAppState } from './IAppState';

export const AppState = (): IAppState => {
  const [game, setGame] = useState('');
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('new');
  const [dialog, setDialog] = useState('');

  useEffect(() => {
    new Image().src = process.env.PUBLIC_URL + '/rubiks-cube-loader.gif';
  }, []);

  const handleStart = (game: string, rows: number, columns: number, difficulty: string) => {
    setGame(game);
    setRows(rows);
    setColumns(columns);
    setDifficulty(difficulty);
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

  return { game, rows, columns, difficulty, status, dialog, handleStart, handleNewGame, handleNewGameConfirm };
};