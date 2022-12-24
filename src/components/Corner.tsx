interface IProps {
  row: number;
  col: number;
  rows: number;
  value?: string;
  topLeftValue?: string;
  topRightValue?: string;
  bottomLeftValue?: string;
  bottomRightValue?: string;
  showCornerValues?: boolean;
  handleClick?(row: number, col: number): void;
  handleRightClick?(row: number, col: number): void;
}

const Corner = (props: IProps) => {
  const {
    row,
    col,
    rows,
    value = "",
    topLeftValue = "",
    topRightValue = "",
    bottomLeftValue = "",
    bottomRightValue = "",
    showCornerValues = false,
    handleClick = (row, col) => { }, handleRightClick = (row, col) => { }
  } = props;

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
      {showCornerValues && topLeftValue && <div className="cornerTopLeft" style={{ fontSize: `${8 / rows}vh` }}>
        {topLeftValue}
      </div>}
      {showCornerValues && topRightValue && <div className="cornerTopRight" style={{ fontSize: `${8 / rows}vh` }}>
        {topRightValue}
      </div>}
      {showCornerValues && bottomLeftValue && <div className="cornerBottomLeft" style={{ fontSize: `${8 / rows}vh` }}>
        {bottomLeftValue}
      </div>}
      {showCornerValues && bottomRightValue && <div className="cornerBottomRight" style={{ fontSize: `${8 / rows}vh` }}>
        {bottomRightValue}
      </div>}
    </div>
  );
};

export default Corner;