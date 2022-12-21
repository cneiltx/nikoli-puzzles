import Game from "./pages/Game";
import Start from "./pages/Start";
import AppState from "./hooks/AppState";

const App = () => {
  const app = AppState();
  return (
    <div className="app">
      {app.status === "new" && <Start handleStart={app.handleStart} />}
      {app.status === "started" && <Game game={app.game} columns={app.columns} rows={app.rows} handleNewGame={app.handleNewGame} />}
    </div>
  );
}

export default App;