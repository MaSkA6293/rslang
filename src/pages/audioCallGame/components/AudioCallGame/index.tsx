import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkipToken, skipToken } from '@reduxjs/toolkit/dist/query';
import { selectPath } from '../../../../features/app/app';
import { useAppSelector } from '../../../../app/hooks';
import { IGetWordPrms } from '../../../../API/types';
import { useGetWordsQuery } from '../../../../API/wordsApi';
import { groupType, pageType } from '../../../../types';

import GameStart from '../GameStart';
import GameIteraion from '../GameIteration';
import GameFinish from '../GameFinish';
import GameButton from '../GameButton';

import './index.scss';
import CrossIcon from '../../assets/icons/cross.svg';

import { IGetWordRes } from '../../../../API/types';
import { shuffle } from '../../utils';
import { selectTextBook } from '../../../../features/textBook/textBook';
import LevelSelect from '../LevelSelect';

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
  const [wordsLevel, setWordsLevel] = useState<groupType>(0);
  const [textbookPage, setTextbookPage] = useState(0);
  const [queryParams, setQueryParams] = useState<IGetWordPrms | SkipToken>(
    skipToken,
  );

  const [isFromTextbook, setIsFromTextbook] = useState(false);

  const path: string = useAppSelector(selectPath);

  const { group, page } = useAppSelector(selectTextBook);

  useEffect(() => {
    if (path === '/textbook') {
      setIsFromTextbook(true);
      setWordsLevel(group);
      setTextbookPage(page);
    } else {
      setIsFromTextbook(false);
    }
  }, []);

  const { data, isFetching, isUninitialized } = useGetWordsQuery(queryParams);

  const isFetched = !isUninitialized && !isFetching && Boolean(words.length);

  useEffect(() => {
    if (isStarted && !isUninitialized && !isFetching && data) {
      const words = shuffle(data).slice(0, 10) as IGetWordRes[];
      setWords(words);

      const options = getOptions(0, words);
      setCurrentIndex(0);
      setAnswerOptions(options);
    }
  }, [data]);

  const handleStart = () => {
    if (!isFromTextbook) {
      const page = (Math.floor(Math.random() * 30) + 1) as pageType;
      setTextbookPage(() => page);
    }
    setQueryParams({ page: textbookPage, group: wordsLevel });
    setIsStarted(true);
  };

  const handleNextWord = (isLearned: boolean) => {
    setResults((prevResults) => [...prevResults, isLearned]);
    setCurrentIndex((i) => i + 1);
    if (currentIndex < words.length) {
      setAnswerOptions(getOptions(currentIndex, words));
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
              <LevelSelect level={wordsLevel} setLevel={setWordsLevel} />
            ) : null}
          </GameStart>
        ) : null}

        {isStarted && !isFetched ? 'Loading...' : null}

        {isFetched && isStarted && currentIndex < words.length ? (
          <GameIteraion
            word={words[currentIndex]}
            onNextWord={handleNextWord}
            options={answerOptions}
          />
        ) : null}

        {isFetched && isStarted && currentIndex >= words.length ? (
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
