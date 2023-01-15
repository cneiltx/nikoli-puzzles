import { SlitherlinkGame } from '../components/SlitherlinkGame';
import { IGameProps } from './IGameProps';

export const Game = (props: IGameProps) => {
  const { game, columns, rows, handleNewGame } = props;

  return (
    <div className='gamePage'>
      <div className='title'>{game}</div>
      {game === 'Slitherlink' && <SlitherlinkGame columns={columns} rows={rows} handleNewGame={handleNewGame} />}
    </div>
  );
}