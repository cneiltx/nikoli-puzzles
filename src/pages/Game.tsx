import SlitherlinkGame from '../components/SlitherlinkGame';

interface IProps {
  game: string;
  columns: number;
  rows: number;
  handleNewGame(): void;
}

const Game = (props: IProps) => {
  const { game, columns, rows, handleNewGame } = props;

  return (
    <div className='gamePage'>
      <div className='title'>{game}</div>
      {game === 'Slitherlink' && <SlitherlinkGame columns={columns} rows={rows} handleNewGame={handleNewGame} />}
    </div>
  );
}

export default Game;