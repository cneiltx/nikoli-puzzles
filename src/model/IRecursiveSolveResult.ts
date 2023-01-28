import { SlitherlinkBoard } from './SlitherlinkBoard';

export interface IRecursiveSolveResult {
  board: SlitherlinkBoard;
  solutions: number;
  maxDepth: number;
  maxIterations: number;
}
