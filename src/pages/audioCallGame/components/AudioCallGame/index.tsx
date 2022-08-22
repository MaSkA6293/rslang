import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GameStart from '../GameStart';
import GameIteraion from '../GameIteration';

import './index.scss';
import CrossIcon from '../../assets/icons/cross.svg';

import words, { Word } from '../../data';
import { shuffle } from '../../utils';
import GameFinish from '../GameFinish';
import GameButton from '../GameButton';

interface IterationState {
  currentWordIndex: number;
  possibleAnswers: Word[];
}

const getOptions = (current: number): Word[] => {
  const wrongAnswers = shuffle(words.filter((_w, i) => i !== current));
  const rightAnswer = words[current];
  return shuffle([...wrongAnswers.slice(0, 4), rightAnswer]);
};

// possibleAnswers зависит от currentWordIndex, поэтому они объединены в один state.
// useReducer не использован из-за того, что action будет иметь лишь один тип.
const initialState: IterationState = {
  currentWordIndex: 0,
  possibleAnswers: [],
};

function AudioCallGame() {
  const [isStarted, setIsStarted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [iterationState, setIterationState] = useState(initialState);
  const navigate = useNavigate();

  const handleStart = () => {
    setIterationState({
      currentWordIndex: 0,
      possibleAnswers: getOptions(0),
    });
    setIsStarted(true);
  };

  const handleNextWord = (isLearned: boolean) => {
    setResults((prevResults) => [...prevResults, isLearned]);
    setIterationState((prevState) => {
      const newIndex = prevState.currentWordIndex + 1;
      return {
        currentWordIndex: newIndex,
        possibleAnswers: getOptions(newIndex),
      };
    });
  };

  const handleRestart = () => {
    setIterationState(initialState);
    handleStart();
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {!isStarted ? <GameStart onStart={handleStart} /> : null}

        {isStarted && iterationState.currentWordIndex < words.length ? (
          <GameIteraion
            word={words[iterationState.currentWordIndex]}
            onNextWord={handleNextWord}
            options={iterationState.possibleAnswers}
          />
        ) : null}

        {isStarted && iterationState.currentWordIndex >= words.length ? (
          <GameFinish
            words={words.map((word, i) => ({ ...word, result: results[i] }))}
            onRestart={handleRestart}
            onClose={handleClose}
          />
        ) : null}
      </div>

      <GameButton
        className="audio-call-game__close-btn"
        onClick={handleClose}
        icon={CrossIcon}
        shape="square"
      />
    </div>
  );
}

export default AudioCallGame;
