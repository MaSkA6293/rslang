import { Route, Routes } from 'react-router-dom';
import './App.scss';
import MainPage from './pages/main';
import Error from './components/Error/Error';
import DicionaryPage from './pages/dictionary';
import AudioCallGamePage from './pages/audioCallGame';
import SprintGamePage from './pages/sprintGame';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dictionary" element={<DicionaryPage />} />
        <Route path="/audioCall" element={<AudioCallGamePage />} />
        <Route path="/sprint" element={<SprintGamePage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
