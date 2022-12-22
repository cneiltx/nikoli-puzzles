interface IProps {
  row: number;
  col: number;
  value?: string;
  handleClick?(row: number, col: number): void;
  handleRightClick?(row: number, col: number): void;
}

const Corner = (props: IProps) => {
  const { row, col, value = "", handleClick = (row, col) => { }, handleRightClick = (row, col) => { } } = props;

  return (
    <div
      className="corner"
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

export default Corner;