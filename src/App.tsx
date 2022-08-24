import { Route, Routes } from 'react-router-dom';
import './App.scss';
import MainPage from './pages/main';
import Error from './components/Error/Error';
import TextbookPage from './pages/textBook';
import AudioCallGamePage from './pages/audioCallGame';
import SprintGamePage from './pages/sprintGame';
import StatisticsPage from './pages/statistics';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/textbook" element={<TextbookPage />} />
        <Route path="/audioCall" element={<AudioCallGamePage />} />
        <Route path="/sprint" element={<SprintGamePage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
