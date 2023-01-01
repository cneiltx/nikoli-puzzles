import Cell from './Cell';
import Corner from './Corner';
import Dialog from './Dialog';
import HEdge from './HEdge';
import VEdge from './VEdge';
import SlitherlinkState from '../hooks/SlitherlinkState';

interface IProps {
  rows: number;
  columns: number;
  handleNewGame(): void;
}

const SlitherlinkGame = (props: IProps) => {
  const { rows, columns, handleNewGame } = props;
  const game = SlitherlinkState(rows, columns);
  const content = [];

  for (let row = 0; row < game.board.rows; row++) {
    for (let col = 0; col < game.board.columns; col++) {
      content.push(
        <Corner
          key={`corner-'${row}-${col}`}
          row={row}
          col={col}
          rows={game.board.rows}
          topLeftValue={Array.from(game.board.corners[row][col].topLeftEdgeCount).join(' ')}
          topRightValue={Array.from(game.board.corners[row][col].topRightEdgeCount).join(' ')}
          bottomLeftValue={Array.from(game.board.corners[row][col].bottomLeftEdgeCount).join(' ')}
          bottomRightValue={Array.from(game.board.corners[row][col].bottomRightEdgeCount).join(' ')}
          showCornerValues={game.debugLevel > 0}
        />);
      content.push(
        <HEdge
          key={`hedge-${row}-${col}`}
          row={row} col={col}
          value={game.board.vEdges[row][col].value}
          handleClick={game.handleHEdgeClick}
          handleRightClick={game.handleHEdgeRightClick} />
      );
    }
    content.push(
      <Corner
        key={`corner-${row}-${game.board.columns}`}
        row={row} col={game.board.columns}
        rows={game.board.rows}
        topLeftValue={Array.from(game.board.corners[row][game.board.columns].topLeftEdgeCount).join(' ')}
        topRightValue={Array.from(game.board.corners[row][game.board.columns].topRightEdgeCount).join(' ')}
        bottomLeftValue={Array.from(game.board.corners[row][game.board.columns].bottomLeftEdgeCount).join(' ')}
        bottomRightValue={Array.from(game.board.corners[row][game.board.columns].bottomRightEdgeCount).join(' ')}
        showCornerValues={game.debugLevel > 0}
      />);

    for (let col = 0; col < game.board.columns; col++) {
      content.push(
        <VEdge
          key={`vedge-${row}-${col}`}
          row={row} col={col}
          value={game.board.hEdges[row][col].value}
          handleClick={game.handleVEdgeClick}
          handleRightClick={game.handleVEdgeRightClick} />
      );
      content.push(
        <Cell key={`cell-${row}-${col}`} row={row} col={col} rows={game.board.rows} value={game.board.cells[row][col].value}
        />
      );
    }
    content.push(
      <VEdge
        key={`vedge-${row}-${game.board.columns}`}
        row={row} col={game.board.columns}
        value={game.board.hEdges[row][game.board.columns].value}
        handleClick={game.handleVEdgeClick}
        handleRightClick={game.handleVEdgeRightClick} />
    );
  }
  for (let col = 0; col < game.board.columns; col++) {
    content.push(
      <Corner
        key={`corner-${game.board.rows}-${col}`}
        row={game.board.rows} col={col}
        rows={game.board.rows}
        topLeftValue={Array.from(game.board.corners[game.board.rows][col].topLeftEdgeCount).join(' ')}
        topRightValue={Array.from(game.board.corners[game.board.rows][col].topRightEdgeCount).join(' ')}
        bottomLeftValue={Array.from(game.board.corners[game.board.rows][col].bottomLeftEdgeCount).join(' ')}
        bottomRightValue={Array.from(game.board.corners[game.board.rows][col].bottomRightEdgeCount).join(' ')}
        showCornerValues={game.debugLevel > 0}
      />);
    content.push(
      <HEdge
        key={`hedge-${game.board.rows}-${col}`}
        row={game.board.rows} col={col}
        value={game.board.vEdges[game.board.rows][col].value}
        handleClick={game.handleHEdgeClick}
        handleRightClick={game.handleHEdgeRightClick} />
    );
  }
  content.push(
    <Corner
      key={`corner-${game.board.rows}-${game.board.columns}`}
      row={game.board.rows} col={game.board.columns}
      rows={game.board.rows}
      topLeftValue={Array.from(game.board.corners[game.board.rows][game.board.columns].topLeftEdgeCount).join(' ')}
      topRightValue={Array.from(game.board.corners[game.board.rows][game.board.columns].topRightEdgeCount).join(' ')}
      bottomLeftValue={Array.from(game.board.corners[game.board.rows][game.board.columns].bottomLeftEdgeCount).join(' ')}
      bottomRightValue={Array.from(game.board.corners[game.board.rows][game.board.columns].bottomRightEdgeCount).join(' ')}
      showCornerValues={game.debugLevel > 0}
    />);

  const boardStyle: Record<string, any> = {
    gridTemplateColumns: '20fr 100fr '.repeat(game.board.columns).concat('20fr'),
    gridTemplateRows: '20fr 100fr '.repeat(game.board.rows).concat('20fr')
  };

  if (game.status === 'solved' || game.dialog !== '') {
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
        <button onClick={handleNewGame} disabled={game.dialog !== ''}>New Game</button>
        <button onClick={game.handleReset} disabled={game.dialog !== ''}>Reset</button>
        <button onClick={game.handleSolve} disabled={game.dialog !== '' || game.status === 'solved'}>Solve</button>
      </div>
      {game.dialog === 'reset' &&
        <Dialog message='Are you sure you want to reset the game?' buttons={['OK', 'Cancel']} handleButtonClick={game.handleResetConfirm} />}
      {game.dialog === 'solve' &&
        <Dialog message='Are you sure you want to see the solution?' buttons={['OK', 'Cancel']} handleButtonClick={game.handleSolveConfirm} />}
      {game.dialog === 'solved' &&
        <Dialog message='Congratulations, you solved it!' quote={game.quote} buttons={['OK']} handleButtonClick={game.handleSolvedConfirm} />}
    </div>
  );
};

export default SlitherlinkGame;