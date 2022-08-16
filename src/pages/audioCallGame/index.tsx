import { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Container from './components/container';
import StartScreen from './components/startScreen';
import GameIteraion from './components/gameIteration';

import './index.scss';

function AudioCallGamePage() {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => setIsStarted(true);
  return (
    <>
      <Header />
      <Container>
        {isStarted ? <GameIteraion /> : <StartScreen onStart={handleStart} />}
      </Container>
      <Footer />
    </>
  );
}

export default AudioCallGamePage;
