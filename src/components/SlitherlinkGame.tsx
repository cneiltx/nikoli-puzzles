import Cell from "./Cell";
import Corner from "./Corner";
import HEdge from "./HEdge";
import VEdge from "./VEdge";
import SlitherlinkState from "../hooks/SlitherlinkState";

interface IProps {
  rows: number;
  columns: number;
  handleNewGame(): void;
}

const SlitherlinkGame = (props: IProps) => {
  const { rows, columns, handleNewGame } = props;
  const game = SlitherlinkState(rows, columns);
  const ignoreClick = (row: number, col: number) => { };
  const content = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      content.push(<Corner key={"corner-" + row + "-" + col} row={row} col={col} value="" handleClick={ignoreClick} handleRightClick={ignoreClick} />);
      content.push(<HEdge key={"hedge-" + row + "-" + col} row={row} col={col} value={game.board.hEdges[row][col].value} handleClick={game.handleHEdgeClick} handleRightClick={game.handleHEdgeRightClick} />);
    }
    content.push(<Corner key={"corner-" + row + "-" + columns} row={row} col={columns} value="" handleClick={ignoreClick} handleRightClick={ignoreClick} />);
    for (let col = 0; col < columns; col++) {
      content.push(<VEdge key={"vedge-" + row + "-" + col} row={row} col={col} value={game.board.vEdges[row][col].value} handleClick={game.handleVEdgeClick} handleRightClick={game.handleVEdgeRightClick} />);
      content.push(<Cell key={"cell-" + row + "-" + col} row={row} col={col} rows={rows} value={game.board.cells[row][col].value} handleClick={ignoreClick} handleRightClick={ignoreClick} />);
    }
    content.push(<VEdge key={"vedge-" + row + "-" + columns} row={row} col={columns} value={game.board.vEdges[row][columns].value} handleClick={game.handleVEdgeClick} handleRightClick={game.handleVEdgeRightClick} />);
  }
  for (let col = 0; col < columns; col++) {
    content.push(<Corner key={"corner-" + rows + "-" + col} row={rows} col={col} value="" handleClick={ignoreClick} handleRightClick={ignoreClick} />);
    content.push(<HEdge key={"hedge-" + rows + "-" + col} row={rows} col={col} value={game.board.hEdges[rows][col].value} handleClick={game.handleHEdgeClick} handleRightClick={game.handleHEdgeRightClick} />);
  }
  content.push(<Corner key={"corner-" + rows + "-" + columns} row={rows} col={columns} value="" handleClick={ignoreClick} handleRightClick={ignoreClick} />);

  return (
    <div className="game">
      <div
        className="gameBoard"
        style={{
          gridTemplateColumns: "10fr 80fr ".repeat(columns).concat("10fr"),
          gridTemplateRows: "10fr 80fr ".repeat(rows).concat("10fr"),
        }}
      >
        {content}
      </div>
      <div className="buttonRow">
        <button onClick={handleNewGame}>New Game</button>
        <button onClick={game.handleReset}>Reset</button>
        <button onClick={game.handleSolve}>Solve</button>
      </div>
    </div>
  );
};

export default SlitherlinkGame;