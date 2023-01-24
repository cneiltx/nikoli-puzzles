export interface IAppState {
  game: string;
  rows: number;
  columns: number;
  difficulty: string;
  status: string;
  dialog: string;
  handleStart: (game: string, rows: number, columns: number, difficulty: string) => void;
  handleNewGame: () => void;
  handleNewGameConfirm: (button: string) => void;
}
