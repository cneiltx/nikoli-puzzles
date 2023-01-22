import { SlitherlinkBoard } from '../model/SlitherlinkBoard';
import { IQuote } from "../components/IQuote";

export interface ISlitherlinkState {
  board: SlitherlinkBoard;
  status: string;
  quote: IQuote;
  canUndo: boolean;
  canRedo: boolean;
  startTime: number;
  handleHEdgeClick: (row: number, col: number) => void;
  handleHEdgeContextMenu: (row: number, col: number) => void;
  handleVEdgeClick: (row: number, col: number) => void;
  handleVEdgeContextMenu: (row: number, col: number) => void;
  handleResetRequest: () => void;
  handleResetConfirm: (button: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleSolveRequest: () => void;
  handleSolveConfirm: (button: string) => void;
  handleUserSolvedConfirm: (button: string) => void;
}
