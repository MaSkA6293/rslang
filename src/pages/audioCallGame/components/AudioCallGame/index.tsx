import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useAppSelector } from '../../../../app/hooks';

import { selectPath } from '../../../../features/app/app';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { IGetWordRes } from '../../../../API/types';
import {
  useGetUserWordsQuery,
  useGetWordsQuery,
} from '../../../../API/wordsApi';
import { groupType, pageType } from '../../../../types';

import GameStart from '../GameStart';
import GameIteraion from '../GameIteration';
import GameFinish from '../GameFinish';
import GameButton from '../GameButton';
import LevelSelect from '../LevelSelect';

import './index.scss';
import CrossIcon from '../../assets/icons/cross.svg';
import { shuffle } from '../../utils';
import { selectCurrentUser } from '../../../../features/auth/authSlice';

const getOptions = (current: number, words: IGetWordRes[]): IGetWordRes[] => {
  const correctAnswer = words[current];
  const wrongAnswers = shuffle(words)
    .filter((_w, i) => i !== current)
    .filter((w) => w.wordTranslate !== correctAnswer.wordTranslate);
  return shuffle([...wrongAnswers.slice(0, 4), correctAnswer]);
};

function AudioCallGame() {
  const navigate = useNavigate();

  const [words, setWords] = useState<IGetWordRes[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const [results, setResults] = useState<boolean[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerOptions, setAnswerOptions] = useState<IGetWordRes[]>([]);

  const [level, setLevel] = useState<groupType>(0);
  const [page, setPage] = useState(0);

  const initGame = (words: IGetWordRes[]) => {
    setWords(words);
    setCurrentIndex(0);
    const options = getOptions(0, words);
    setAnswerOptions(options);
  };

  // check if run from texbook

  const [isFromTextbook, setIsFromTextbook] = useState(false);

  const path: string = useAppSelector(selectPath);

  const textbookState = useAppSelector(selectTextBook);

  useEffect(() => {
    if (path === '/textbook') {
      setIsFromTextbook(true);
      setLevel(textbookState.group);
      setPage(textbookState.page);
    } else {
      setIsFromTextbook(false);
    }
  }, []);

  // get words

  const { userId } = useAppSelector(selectCurrentUser);

  const wordsQParams = { page, group: level };
  const wordsResp = useGetWordsQuery(wordsQParams);

  const userWordsResp = useGetUserWordsQuery(userId ? { userId } : skipToken);

  const isLoading =
    wordsResp.isUninitialized || wordsResp.isLoading || words.length === 0;

  useEffect(() => {
    if (!isStarted) return;

    const { isUninitialized, isFetching, data: wordsData } = wordsResp;
    if (isUninitialized || isFetching || !wordsData) return;

    const allWords: IGetWordRes[] = wordsData;

    if (userId !== null && isFromTextbook) {
      const {
        isUninitialized,
        isFetching,
        data: userWords = [],
      } = userWordsResp;
      if (isUninitialized || isFetching) return;

      // filter learned words
      const filteredWords = allWords.filter((w) => {
        const uWord = userWords.find((uw) => w.id === uw.wordId);
        return !uWord || uWord?.optional.learned === false;
      });

      const words = shuffle(filteredWords).slice(0, 10);
      initGame(words);
    } else {
      const words = shuffle(allWords).slice(0, 10);
      initGame(words);
    }
  }, [wordsResp.data, userWordsResp.data, userId]);

  // start game

  const handleStart = () => {
    if (!isFromTextbook) {
      const page = (Math.floor(Math.random() * 30) + 1) as pageType;
      setPage(() => page);
    }
    setIsStarted(true);
  };

  const handleNextWord = (isCorrect: boolean) => {
    setResults((prevResults) => [...prevResults, isCorrect]);
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    if (nextIndex < words.length) {
      setAnswerOptions(() => getOptions(nextIndex, words));
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswerOptions([]);
    setIsStarted(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {!isStarted ? (
          <GameStart onStart={handleStart}>
            {!isFromTextbook ? (
              <LevelSelect level={level} setLevel={setLevel} />
            ) : null}
          </GameStart>
        ) : null}

        {isStarted && isLoading ? 'Loading...' : null}

        {!isLoading && isStarted && currentIndex < words.length ? (
          <GameIteraion
            word={words[currentIndex]}
            onNextWord={handleNextWord}
            options={answerOptions}
          />
        ) : null}

        {!isLoading && isStarted && currentIndex >= words.length ? (
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
