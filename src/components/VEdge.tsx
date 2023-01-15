import { IVEdgeProps } from "./IVEdgeProps";

export const VEdge = (props: IVEdgeProps) => {
  const { row, col, value = '', handleClick = (row, col) => { }, handleContextMenu = (row, col) => { } } = props;

  const style: Record<string, any> = {};
  if (value === '-') {
    style.backgroundColor = '#cabba7';
  } else if (value === 'x') {
    style.background = 'repeating-linear-gradient(-45deg, transparent, transparent 1vh, #a22 1vh, #a22 1.1vh)';
  }

  return (
    <div
      className='edge'
      style={style}
      onClick={() => handleClick(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu(row, col);
      }
      }
    >
    </div>
  );
};