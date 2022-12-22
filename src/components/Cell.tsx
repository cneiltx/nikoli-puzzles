interface IProps {
  row: number;
  col: number;
  rows: number;
  value?: string;
  handleClick?(row: number, col: number): void;
  handleRightClick?(row: number, col: number): void;
}

const Cell = (props: IProps) => {
  const { row, col, rows, value = "", handleClick = (row, col) => { }, handleRightClick = (row, col) => { } } = props;

  return (
    <div
      className="cell"
      style={{
        fontSize: `${35 / rows}vh`,
      }}
      onClick={() => handleClick(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightClick(row, col);
      }
      }
    >
      {value}
    </div>
  );
};

export default Cell;