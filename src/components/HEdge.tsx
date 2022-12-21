interface IProps {
  row: number;
  col: number;
  value: string;
  handleClick(row: number, col: number): void;
  handleRightClick(row: number, col: number): void;
}

const HEdge = (props: IProps) => {
  const { row, col, value, handleClick, handleRightClick } = props;

  const style: Record<string, any> = {};
  if (value === "-") {
    style.backgroundColor = "#cabba7";
  } else if (value === "x") {
    style.background = "repeating-linear-gradient(-45deg, transparent, transparent 1vh, #a22 1vh, #a22 1.1vh)";
  }

  return (
    <div
      className="edge"
      style={style}
      onClick={() => handleClick(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleRightClick(row, col);
      }
      }
    >
    </div>
  );
};

export default HEdge;