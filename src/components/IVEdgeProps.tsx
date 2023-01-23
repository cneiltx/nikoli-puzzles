import { VEdge } from "../model/VEdge";

export interface IVEdgeProps {
  row: number;
  col: number;
  value?: string;
  edge: VEdge;
  handleClick?(row: number, col: number): void;
  handleContextMenu?(row: number, col: number): void;
}
