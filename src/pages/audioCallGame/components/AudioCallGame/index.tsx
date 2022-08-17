import { useState } from 'react';

import StartScreen from '../StartScreen';
import GameIteraion from '../GameIteration';

import './index.scss';

function AudioCallGame() {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => setIsStarted(true);

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {isStarted ? <GameIteraion /> : <StartScreen onStart={handleStart} />}
      </div>
    </div>
  );
}

export default AudioCallGame;
