import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Error from './components/Error/Error';
import Layout from './components/Layout/Layout';
import RequireAuth from './components/RequireAuth/RequireAuth';
import MainPage from './pages/main';
import NewAudioCallPage from './pages/NewAudioCallGame';
import Profile from './pages/Profile/Profile';
import SprintGamePage from './pages/sprintGame';
import StatisticsPage from './pages/statistics';
import TextbookPage from './pages/textBook';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<MainPage />} />
          <Route path="/textbook" element={<TextbookPage />} />
          <Route path="/audioCall" element={<NewAudioCallPage />} />
          <Route path="/sprint" element={<SprintGamePage />} />
          <Route path="/statistics" element={<RequireAuth><StatisticsPage /></RequireAuth>}/>
          <Route path='/profile' element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
