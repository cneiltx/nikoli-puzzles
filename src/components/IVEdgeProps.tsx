export interface IVEdgeProps {
  row: number;
  col: number;
  value?: string;
  handleClick?(row: number, col: number): void;
  handleContextMenu?(row: number, col: number): void;
}
