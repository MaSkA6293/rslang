import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetWordsQuery } from '../../../../API/wordsApi';
import { groupType, pageType } from '../../../../types';

import GameStart from '../GameStart';
import GameIteraion from '../GameIteration';
import GameFinish from '../GameFinish';
import GameButton from '../GameButton';

import './index.scss';
import CrossIcon from '../../assets/icons/cross.svg';

import { Word } from '../../data';
import { shuffle } from '../../utils';

interface IterationState {
  currentWordIndex: number;
  possibleAnswers: Word[];
}

interface IGetWords {
  page: pageType;
  group: groupType;
}

// possibleAnswers зависит от currentWordIndex, поэтому они объединены в один state.
// useReducer не использован из-за того, что action будет иметь лишь один тип.
const initialState: IterationState = {
  currentWordIndex: 0,
  possibleAnswers: [],
};

const initialLevel: groupType = 0;
const initialQueryParams: IGetWords = { group: initialLevel, page: 0 };

const getOptions = (current: number, words: Word[]): Word[] => {
  const wrongAnswers = shuffle(words.filter((_w, i) => i !== current));
  const correctAnswer = words[current];
  return shuffle([...wrongAnswers.slice(0, 4), correctAnswer]);
};

function AudioCallGame() {
  const navigate = useNavigate();

  const [words, setWords] = useState<Word[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [iterationState, setIterationState] = useState(initialState);
  const [wordsLevel, setWordsLevel] = useState(initialLevel);
  const [queryParams, setQueryParams] = useState(initialQueryParams);

  const { data, isFetching, isUninitialized } = useGetWordsQuery(queryParams);

  const isFetched = !isUninitialized && !isFetching && Boolean(words.length);

  useEffect(() => {
    if (isStarted && !isUninitialized && !isFetching && data) {
      const words = shuffle(data).slice(0, 10) as Word[];
      setWords(words);

      const options = getOptions(0, words);
      setIterationState({
        currentWordIndex: 0,
        possibleAnswers: options,
      });
    }
  }, [data]);

  const handleStart = () => {
    const page = (Math.floor(Math.random() * 30) + 1) as pageType;
    const group = wordsLevel;
    setQueryParams({ page, group });
    setIsStarted(true);
  };

  const handleNextWord = (isLearned: boolean) => {
    setResults((prevResults) => [...prevResults, isLearned]);
    setIterationState((prevState) => {
      const newIndex = prevState.currentWordIndex + 1;
      return {
        currentWordIndex: newIndex,
        possibleAnswers: getOptions(newIndex, words),
      };
    });
  };

  const handleRestart = () => {
    setIterationState(initialState);
    setIsStarted(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {!isStarted ? (
          <GameStart
            onStart={handleStart}
            level={wordsLevel}
            setLevel={setWordsLevel}
          />
        ) : null}

        {isFetched &&
        isStarted &&
        iterationState.currentWordIndex < words.length ? (
          <GameIteraion
            word={words[iterationState.currentWordIndex]}
            onNextWord={handleNextWord}
            options={iterationState.possibleAnswers}
          />
        ) : null}

        {isFetched &&
        isStarted &&
        iterationState.currentWordIndex >= words.length ? (
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
