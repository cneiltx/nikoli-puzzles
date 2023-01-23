import { useState, FormEvent } from 'react';
import { IStartProps } from './IStartProps';

export const Start = (props: IStartProps) => {
  const { handleStart } = props;
  const [game, setGame] = useState('Slitherlink');
  const [boardSize, setBoardSize] = useState('7x7');

  const handleSelectGame = (e: FormEvent<HTMLSelectElement>) => {
    setGame(e.currentTarget.value);
  }

  const handleSelectSize = (e: FormEvent<HTMLSelectElement>) => {
    setBoardSize(e.currentTarget.value);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rows = +boardSize.substring(0, boardSize.indexOf('x'));
    const columns = +boardSize.substring(boardSize.indexOf('x') + 1);
    handleStart(game, columns, rows);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='startPage'>
        <div className='title'>Game Selection</div>
        <div className='buttonRow'>
          <div>
            <label>Game </label>
            <select value={game} onChange={(e) => handleSelectGame(e)}>
              <option value='Slitherlink'>Slitherlink</option>
            </select>
          </div>
          <div>
            <label>Board Size </label>
            <select value={boardSize} onChange={(e) => handleSelectSize(e)}>
              <option value='5x5'>5 x 5</option>
              <option value='7x7'>7 x 7</option>
              <option value='10x10'>10 x 10</option>
              <option value='15x15'>15 x 15</option>
              <option value='24x12'>24 x 12</option>
              <option value='20x20'>20 x 20</option>
            </select>
          </div>
        </div>
        <div className='buttonRow'>
          <button type='submit' autoFocus>Start</button>
        </div>
      </div>
    </form>
  );
};