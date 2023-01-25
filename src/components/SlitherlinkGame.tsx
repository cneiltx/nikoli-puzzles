import { Cell } from './Cell';
import { Corner } from './Corner';
import { Dialog } from './Dialog';
import { HEdge } from './HEdge';
import { VEdge } from './VEdge';
import { SlitherlinkState } from '../hooks/SlitherlinkState';
import { ISlitherlinkGameProps } from './ISlitherlinkGameProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const SlitherlinkGame = (props: ISlitherlinkGameProps) => {
  const { rows, columns, difficulty, handleNewGame } = props;
  const game = SlitherlinkState(rows, columns, difficulty);
  const [showHelp, setShowHelp] = useState(false);
  const content = [];

  for (let row = 0; row < game.board.rows; row++) {
    for (let col = 0; col < game.board.columns; col++) {
      content.push(<Corner key={`corner-'${row}-${col}`} row={row} col={col} />);
      content.push(
        <VEdge
          key={`vedge-${row}-${col}`}
          row={row} col={col}
          value={game.board.vEdges[row][col].value}
          edge={game.board.vEdges[row][col]}
          handleClick={game.handleVEdgeClick}
          handleContextMenu={game.handleVEdgeContextMenu} />
      );
    }
    content.push(<Corner key={`corner-${row}-${game.board.columns}`} row={row} col={game.board.columns} />);

    for (let col = 0; col < game.board.columns; col++) {
      content.push(
        <HEdge
          key={`hedge-${row}-${col}`}
          row={row} col={col}
          value={game.board.hEdges[row][col].value}
          edge={game.board.hEdges[row][col]}
          handleClick={game.handleHEdgeClick}
          handleContextMenu={game.handleHEdgeContextMenu} />
      );
      content.push(
        <Cell
          key={`cell-${row}-${col}`}
          row={row} col={col}
          rows={game.board.rows}
          value={game.board.cells[row][col].value}
          handleClickTop={game.handleVEdgeClick}
          handleClickBottom={game.handleVEdgeClick}
          handleClickLeft={game.handleHEdgeClick}
          handleClickRight={game.handleHEdgeClick}
          handleContextMenuTop={game.handleVEdgeContextMenu}
          handleContextMenuBottom={game.handleVEdgeContextMenu}
          handleContextMenuLeft={game.handleHEdgeContextMenu}
          handleContextMenuRight={game.handleHEdgeContextMenu}
        />
      );
    }
    content.push(
      <HEdge
        key={`hedge-${row}-${game.board.columns}`}
        row={row} col={game.board.columns}
        value={game.board.hEdges[row][game.board.columns].value}
        edge={game.board.hEdges[row][game.board.columns]}
        handleClick={game.handleHEdgeClick}
        handleContextMenu={game.handleHEdgeContextMenu} />
    );
  }
  for (let col = 0; col < game.board.columns; col++) {
    content.push(<Corner key={`corner-${game.board.rows}-${col}`} row={game.board.rows} col={col} />);
    content.push(
      <VEdge
        key={`vedge-${game.board.rows}-${col}`}
        row={game.board.rows} col={col}
        value={game.board.vEdges[game.board.rows][col].value}
        edge={game.board.vEdges[game.board.rows][col]}
        handleClick={game.handleVEdgeClick}
        handleContextMenu={game.handleVEdgeContextMenu} />
    );
  }
  content.push(<Corner key={`corner-${game.board.rows}-${game.board.columns}`} row={game.board.rows} col={game.board.columns} />);

  const boardStyle: Record<string, any> = {
    gridTemplateColumns: '20fr 100fr '.repeat(game.board.columns).concat('20fr'),
    gridTemplateRows: '20fr 100fr '.repeat(game.board.rows).concat('20fr'),
    aspectRatio: `${game.board.columns} / ${game.board.rows}`,
  };

  if (game.status === 'solved') {
    boardStyle.pointerEvents = 'none';
  }

  const getElapsedTime = () => {
    const elapsed = Date.now() - game.startTime;
    const hours = Math.floor(elapsed / 1000 / 60 / 60);
    const minutes = Math.floor((elapsed / 1000 / 60) % 60);
    const seconds = Math.floor((elapsed / 1000) % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const handleHelp = () => {
    setShowHelp(true);
  }

  const handleHelpDismissed = () => {
    setShowHelp(false);
  }

  const helpText = `Click between the dots to form a single loop 
  that does not cross itself or branch.

    Cells with numbers indicate how many lines 
    must surround the cell.
    
    Empty cells can be surrounded by any number of lines.

    Right-click to mark excluded edges.`;

  return (
    <div className='game'>
      <div
        className='gameBoard'
        style={boardStyle}
      >
        {content}
      </div>
      <div className='buttonRow'>
        <button onClick={handleHelp}>
          <FontAwesomeIcon icon={faCircleInfo} />
        </button>
        <button onClick={handleNewGame} disabled={!['playing', 'solved'].includes(game.status)}>New Game</button>
        <button onClick={game.handleResetRequest} disabled={!['playing', 'solved'].includes(game.status)}>Reset</button>
        <button onClick={game.handleUndo} disabled={!['playing', 'solved'].includes(game.status) || !game.canUndo}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button onClick={game.handleRedo} disabled={!['playing', 'solved'].includes(game.status) || !game.canRedo}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
        <button onClick={game.handleSolveRequest} disabled={game.status !== 'playing'}>Solve</button>
      </div>
      {showHelp &&
        <Dialog message={helpText} buttons={['OK']} handleButtonClick={handleHelpDismissed} />}
      {game.status === 'generating' &&
        <Dialog message={`Generating game board...`} imagePath={process.env.PUBLIC_URL + '/rubiks-cube-loader.gif'} />}
      {game.status === 'resetRequest' &&
        <Dialog message='Are you sure you want to reset the game?' buttons={['OK', 'Cancel']} handleButtonClick={game.handleResetConfirm} />}
      {game.status === 'solveRequest' &&
        <Dialog message='Are you sure you want to see the solution?' buttons={['OK', 'Cancel']} handleButtonClick={game.handleSolveConfirm} />}
      {game.status === 'userSolved' &&
        <Dialog
          message={`Congratulations, you solved it!\nElapsed time: ${getElapsedTime()}`}
          quote={game.quote} buttons={['OK']}
          handleButtonClick={game.handleUserSolvedConfirm}
        />}
      {game.status === 'autoSolving' &&
        <Dialog message='Solving...' imagePath={process.env.PUBLIC_URL + '/rubiks-cube-loader.gif'} />}
    </div>
  );
};