import { useState } from 'react';

import StartScreen from '../StartScreen';
import GameIteraion from '../GameIteration';

import './index.scss';

function AudioCallGame() {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => setIsStarted(true);

  return (
    <div className="audio-call-game">
      {isStarted ? <GameIteraion /> : <StartScreen onStart={handleStart} />}
    </div>
  );
}

export default AudioCallGame;
