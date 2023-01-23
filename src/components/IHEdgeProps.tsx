import { HEdge } from "../model/HEdge";

export interface IHEdgeProps {
  row: number;
  col: number;
  value?: string;
  edge: HEdge;
  handleClick?(row: number, col: number): void;
  handleContextMenu?(row: number, col: number): void;
}
