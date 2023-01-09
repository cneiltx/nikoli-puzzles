interface IProps {
  row: number;
  col: number;
  value?: string;
  handleClick?(row: number, col: number): void;
  handleContextMenu?(row: number, col: number): void;
}

const Corner = (props: IProps) => {
  const {
    row,
    col,
    value = '',
    handleClick = (row, col) => { }, handleContextMenu = (row, col) => { }
  } = props;

  return (
    <div
      className='corner'
      onClick={() => handleClick(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu(row, col);
      }
      }
    >
      {value}
    </div>
  );
};

export default Corner;