import { Cell } from './Cell';
import { Corner } from './Corner';
import { Dialog } from './Dialog';
import { HEdge } from './HEdge';
import { VEdge } from './VEdge';
import { SlitherlinkState } from '../hooks/SlitherlinkState';
import { ISlitherlinkGameProps } from './ISlitherlinkGameProps';

export const SlitherlinkGame = (props: ISlitherlinkGameProps) => {
  const { rows, columns, handleNewGame } = props;
  const game = SlitherlinkState(rows, columns);
  const content = [];

  for (let row = 0; row < game.board.rows; row++) {
    for (let col = 0; col < game.board.columns; col++) {
      content.push(<Corner key={`corner-'${row}-${col}`} row={row} col={col} />);
      content.push(
        <VEdge
          key={`vedge-${row}-${col}`}
          row={row} col={col}
          value={game.board.vEdges[row][col].value}
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

  return (
    <div className='game'>
      <div
        className='gameBoard'
        style={boardStyle}
      >
        {content}
      </div>
      <div className='buttonRow'>
        <button onClick={handleNewGame} disabled={!['playing', 'solved'].includes(game.status)}>New Game</button>
        <button onClick={game.handleResetRequest} disabled={!['playing', 'solved'].includes(game.status)}>Reset</button>
        <button onClick={game.handleSolveRequest} disabled={game.status !== 'playing'}>Solve</button>
      </div>
      {game.status === 'resetRequest' &&
        <Dialog message='Are you sure you want to reset the game?' buttons={['OK', 'Cancel']} handleButtonClick={game.handleResetConfirm} />}
      {game.status === 'solveRequest' &&
        <Dialog message='Are you sure you want to see the solution?' buttons={['OK', 'Cancel']} handleButtonClick={game.handleSolveConfirm} />}
      {game.status === 'userSolved' &&
        <Dialog message='Congratulations, you solved it!' quote={game.quote} buttons={['OK']} handleButtonClick={game.handleUserSolvedConfirm} />}
      {game.status === 'autoSolving' &&
        <Dialog message='Solving...' imagePath={process.env.PUBLIC_URL + '/rubiks-cube-loader.gif'} />}
    </div>
  );
};