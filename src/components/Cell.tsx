import React, { useEffect, useState, useRef } from 'react';

interface IProps {
  row: number;
  col: number;
  rows: number;
  value?: string;
  handleClick?(row: number, col: number): void;
  handleClickTop(row: number, col: number): void;
  handleClickBottom(row: number, col: number): void;
  handleClickLeft(row: number, col: number): void;
  handleClickRight(row: number, col: number): void;
  handleContextMenu?(row: number, col: number): void;
  handleContextMenuTop(row: number, col: number): void;
  handleContextMenuBottom(row: number, col: number): void;
  handleContextMenuLeft(row: number, col: number): void;
  handleContextMenuRight(row: number, col: number): void;
}

const Cell = (props: IProps) => {
  const {
    row,
    col,
    rows,
    value = '',
    handleClick = (row, col) => { },
    handleClickTop,
    handleClickBottom,
    handleClickLeft,
    handleClickRight,
    handleContextMenu = (row, col) => { },
    handleContextMenuTop,
    handleContextMenuBottom,
    handleContextMenuLeft,
    handleContextMenuRight
  } = props;

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
      setWidth(ref.current.clientHeight);
    }
  }, []);

  return (
    <div
      ref={ref}
      className='cell'
      style={{
        fontSize: `${35 / rows}vh`,
      }}
      onClick={(e) => {
        let target = e.target as HTMLDivElement;
        let mouseX = e.clientX - target.offsetLeft;
        let mouseY = e.clientY - target.offsetTop;

        if (mouseY / height < .25 && mouseX / width > .25 && mouseX / width < .75) {
          handleClickTop(row, col);
        } else if (mouseY / height > .75 && mouseX / width > .25 && mouseX / width < .75) {
          handleClickBottom(row + 1, col);
        } else if (mouseX / width < .25 && mouseY / height > .25 && mouseY / height < .75) {
          handleClickLeft(row, col);
        } else if (mouseX / width > .75 && mouseY / height > .25 && mouseY / height < .75) {
          handleClickRight(row, col + 1);
        } else {
          handleClick(row, col);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();

        let target = e.target as HTMLDivElement;
        let mouseX = e.clientX - target.offsetLeft;
        let mouseY = e.clientY - target.offsetTop;

        if (mouseY / height < .25 && mouseX / width > .25 && mouseX / width < .75) {
          handleContextMenuTop(row, col);
        } else if (mouseY / height > .75 && mouseX / width > .25 && mouseX / width < .75) {
          handleContextMenuBottom(row + 1, col);
        } else if (mouseX / width < .25 && mouseY / height > .25 && mouseY / height < .75) {
          handleContextMenuLeft(row, col);
        } else if (mouseX / width > .75 && mouseY / height > .25 && mouseY / height < .75) {
          handleContextMenuRight(row, col + 1);
        } else {
          handleContextMenu(row, col);
        }
      }
      }
    >
      {value}
    </div>
  );
};

export default Cell;