import Cell from "./Cell";
import Corner from "./Corner";
import Dialog from "./Dialog";
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
  const content = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      content.push(<Corner key={`corner-"${row}-${col}`} row={row} col={col} />);
      content.push(<HEdge key={`hedge-${row}-${col}`} row={row} col={col} value={game.board.hEdges[row][col].value} handleClick={game.handleHEdgeClick} handleRightClick={game.handleHEdgeRightClick} />);
    }
    content.push(<Corner key={`corner-${row}-${columns}`} row={row} col={columns} />);
    for (let col = 0; col < columns; col++) {
      content.push(<VEdge key={`vedge-${row}-${col}`} row={row} col={col} value={game.board.vEdges[row][col].value} handleClick={game.handleVEdgeClick} handleRightClick={game.handleVEdgeRightClick} />);
      content.push(<Cell key={`cell-${row}-${col}`} row={row} col={col} rows={rows} value={game.board.cells[row][col].value} />);
    }
    content.push(<VEdge key={`vedge-${row}-${columns}`} row={row} col={columns} value={game.board.vEdges[row][columns].value} handleClick={game.handleVEdgeClick} handleRightClick={game.handleVEdgeRightClick} />);
  }
  for (let col = 0; col < columns; col++) {
    content.push(<Corner key={`corner-${rows}-${col}`} row={rows} col={col} />);
    content.push(<HEdge key={`hedge-${rows}-${col}`} row={rows} col={col} value={game.board.hEdges[rows][col].value} handleClick={game.handleHEdgeClick} handleRightClick={game.handleHEdgeRightClick} />);
  }
  content.push(<Corner key={`corner-${rows}-${columns}`} row={rows} col={columns} />);

  const boardStyle: Record<string, any> = {
    gridTemplateColumns: "20fr 100fr ".repeat(columns).concat("20fr"),
    gridTemplateRows: "20fr 100fr ".repeat(rows).concat("20fr")
  };

  if (game.status === "solved" || game.dialog !== "") {
    boardStyle.pointerEvents = "none";
  }

  return (
    <div className="game">
      <div
        className="gameBoard"
        style={boardStyle}
      >
        {content}
      </div>
      <div className="buttonRow">
        <button onClick={handleNewGame} disabled={game.dialog !== ""}>New Game</button>
        <button onClick={game.handleReset} disabled={game.dialog !== ""}>Reset</button>
        <button onClick={game.handleSolve} disabled={game.dialog !== "" || game.status === "solved"}>Solve</button>
      </div>
      {game.dialog === "reset" && <Dialog message="Are you sure you want to reset the game?" buttons={["OK", "Cancel"]} handleButtonClick={game.handleResetConfirm} />}
      {game.dialog === "solve" && <Dialog message="Are you sure you want to see the solution?" buttons={["OK", "Cancel"]} handleButtonClick={game.handleSolveConfirm} />}
      {game.dialog === "solved" && <Dialog message="Congratulations, you solved it!" quote={game.quote} buttons={["OK"]} handleButtonClick={game.handleSolvedConfirm} />}
    </div>
  );
};

export default SlitherlinkGame;