export interface IAppState {
  game: string;
  rows: number;
  columns: number;
  status: string;
  dialog: string;
  handleStart: (game: string, rows: number, columns: number) => void;
  handleNewGame: () => void;
  handleNewGameConfirm: (button: string) => void;
}
