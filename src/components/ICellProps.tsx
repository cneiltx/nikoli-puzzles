export interface ICellProps {
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
