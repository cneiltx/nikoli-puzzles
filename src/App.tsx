import { Dialog } from './components/Dialog';
import { Game } from './pages/Game';
import { Start } from './pages/Start';
import { AppState } from './hooks/AppState';

export const App = () => {
  const app = AppState();
  return (
    <div className='app'>
      {app.status === 'new' && <Start handleStart={app.handleStart} />}
      {app.status === 'started' && <Game game={app.game} columns={app.columns} rows={app.rows} handleNewGame={app.handleNewGame} />}
      {app.dialog === 'newGame' &&
        <Dialog message='Are you sure you want to start a new game?' buttons={['OK', 'Cancel']} handleButtonClick={app.handleNewGameConfirm} />}
    </div>
  );
}