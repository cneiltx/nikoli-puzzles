import { ICornerProps } from "./ICornerProps";

export const Corner = (props: ICornerProps) => {
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