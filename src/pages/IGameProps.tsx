export interface IGameProps {
  game: string;
  columns: number;
  rows: number;
  difficulty: string;
  handleNewGame(): void;
}
