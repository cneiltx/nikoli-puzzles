import React, { useState, FormEvent } from 'react';
import { IStartProps } from './IStartProps';

export const Start = (props: IStartProps) => {
  const { handleStart } = props;
  const [game, setGame] = useState('Slitherlink');
  const [boardSize, setBoardSize] = useState('5x5');
  const [difficulty, setDifficulty] = useState('easy');

  const handleSelectSize = (e: React.MouseEvent) => {
    setBoardSize(e.currentTarget.id);
  }

  const handleSelectDifficulty = (e: React.MouseEvent) => {
    setDifficulty(e.currentTarget.id);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    const rows = +boardSize.substring(0, boardSize.indexOf('x'));
    const columns = +boardSize.substring(boardSize.indexOf('x') + 1);
    handleStart(game, columns, rows, difficulty);
  }

  return (
    <div className='startPage'>
      <div className='verticalSelector'>
        <div id='5x5' onClick={(e) => handleSelectSize(e)} className={'selector' + (boardSize === '5x5' ? ' selected' : '')}>5 x 5</div>
        <div id='7x7' onClick={(e) => handleSelectSize(e)} className={'selector' + (boardSize === '7x7' ? ' selected' : '')}>7 x 7</div>
        <div id='10x10' onClick={(e) => handleSelectSize(e)} className={'selector' + (boardSize === '10x10' ? ' selected' : '')}>10 x 10</div>
        <div id='15x15' onClick={(e) => handleSelectSize(e)} className={'selector' + (boardSize === '15x15' ? ' selected' : '')}>15 x 15</div>
        <div id='24x12' onClick={(e) => handleSelectSize(e)} className={'selector' + (boardSize === '24x12' ? ' selected' : '')}>24 x 12</div>
        <div id='20x20' onClick={(e) => handleSelectSize(e)} className={'selector' + (boardSize === '20x20' ? ' selected' : '')}>20 x 20</div>
      </div>
      <div className='verticalSelector'>
        <div id='easy' onClick={(e) => handleSelectDifficulty(e)} className={'selector' + (difficulty === 'easy' ? ' selected' : '')}>Easy</div>
        <div id='medium' onClick={(e) => handleSelectDifficulty(e)} className={'selector' + (difficulty === 'medium' ? ' selected' : '')}>Medium</div>
        <div id='hard' onClick={(e) => handleSelectDifficulty(e)} className={'selector' + (difficulty === 'hard' ? ' selected' : '')}>Hard</div>
      </div>
      <button className='bigButton' onClick={(e) => handleSubmit(e)} autoFocus>Go!</button>
    </div>
  );
};