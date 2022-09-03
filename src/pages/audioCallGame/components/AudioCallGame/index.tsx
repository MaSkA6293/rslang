import { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';

import { useAppSelector } from '../../../../app/hooks';
import { selectPath } from '../../../../features/app/app';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import {
  IGetWordRes,
  IResultGame,
  IUserWordCreate,
} from '../../../../API/types';
import {
  useCreateUserWordMutation,
  useGetUserWordsQuery,
  useGetWordsQuery,
  useUpdateUserWordMutation,
} from '../../../../API/wordsApi';
import {
  useGetUserStatisticQuery,
  useUpsertUserStatisticMutation,
} from '../../../../API/userApi';
import { GameActions, GameState, GameStates } from '../../types';

import { getBestSeriesCount, getNewUserWord, shuffle } from '../../utils';
import { gameReducer } from './reducer';
import GameStart from '../GameStart';
import GameIteraion from '../GameIteration';
import GameFinish from '../GameFinish';
import GameButton from '../GameButton';
import LevelSelect from '../LevelSelect';

import './index.scss';
import CrossIcon from '../../assets/icons/cross.svg';
import { groupType, pageType } from '../../../../types';

const WORDS_PER_GAME_COUNT = 10;

const initialGameState: GameState = {
  level: 0,
  isFromTextbook: false,
  words: [],
  userWords: [],
  state: GameStates.NotStarted,
  iteration: {
    curIndex: 0,
    options: [],
  },
  wordsResults: [],
};

function AudioCallGame() {
  const navigate = useNavigate();

  const { userId } = useAppSelector(selectCurrentUser);

  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [textbookPage, setTextbookPage] = useState<pageType>(0);

  const handleStart = () => {
    dispatch({ type: GameActions.Start });
  };

  const handleNextWord = (isCorrect: boolean) => {
    dispatch({
      type: GameActions.GoToNextWord,
      payload: { result: isCorrect },
    });
  };

  const handleRestart = () => {
    dispatch({ type: GameActions.Reset });
  };

  useEffect(handleRestart, [userId]);

  const handleClose = () => {
    navigate('/');
  };

  const handleLevelSelect = (level: groupType) => {
    dispatch({
      type: GameActions.ChangeLevel,
      payload: { level },
    });
  };

  // check if run from texbook

  const path = useAppSelector(selectPath);
  const textbookState = useAppSelector(selectTextBook);

  useEffect(() => {
    if (path === '/textbook') {
      const { group, page } = textbookState;

      setTextbookPage(page);
      dispatch({
        type: GameActions.SetFromTextbook,
        payload: { level: group },
      });
    } else {
      const randomPage = (Math.floor(Math.random() * 29) + 1) as pageType;
      setTextbookPage(randomPage);
    }
  }, []);

  // get words

  const wordsQParams = { page: textbookPage, group: gameState.level };
  const wordsResp = useGetWordsQuery(wordsQParams);
  const userWordsResp = useGetUserWordsQuery(userId ? { userId } : skipToken);
  const userStatsResp = useGetUserStatisticQuery(
    userId ? { userId } : skipToken,
  );
  const { data: allWords } = wordsResp;
  const { data: userWords } = userWordsResp;
  const { data: userStats } = userStatsResp;

  const learnedWords =
    userWords?.filter((word) => !word.optional.learned) || [];

  const isFetching =
    wordsResp.isUninitialized ||
    wordsResp.isFetching ||
    userWordsResp.isFetching ||
    userStatsResp.isFetching;

  const filterWords = (
    allWordsOnPage: IGetWordRes[],
    excludeLearned: boolean,
  ) =>
    excludeLearned
      ? allWordsOnPage.filter(
          (word) =>
            !learnedWords?.some((userWord) => userWord.wordId === word.id),
        )
      : allWordsOnPage;

  useEffect(() => {
    if (gameState.state !== GameStates.InProgress) return;
    if (isFetching) return;
    if (!allWords) return;

    const excludeLearned = userId !== null && gameState.isFromTextbook;
    const currentWords = filterWords(allWords, excludeLearned);
    const accWords = [...gameState.words, ...currentWords];
    if (accWords.length < WORDS_PER_GAME_COUNT && textbookPage > 0) {
      dispatch({
        type: GameActions.SetWords,
        payload: { words: accWords },
      });
      setTextbookPage((page) => (page - 1) as pageType);
      return;
    }
    dispatch({
      type: GameActions.Initialize,
      payload: { words: shuffle(accWords).slice(0, WORDS_PER_GAME_COUNT) },
    });
  }, [allWords, userWords, userStats, gameState.state]);

  // save results

  const [createUserWord, { isLoading: isUWordCreating }] =
    useCreateUserWordMutation();
  const [updateUserWord, { isLoading: isUWordUpdating }] =
    useUpdateUserWordMutation();

  const saveResults = () => {
    if (userId === null) return;

    gameState.words.forEach((w, i) => {
      const isSuccess = gameState.wordsResults[i];
      const userWord = userWordsResp.data?.find((uw) => uw.wordId === w.id);

      if (!userWord) {
        const newUserWord = getNewUserWord(isSuccess);
        createUserWord({ userId, wordId: w.id, body: newUserWord });
        return;
      }

      const {
        success: prevSuccess,
        fail: prevFail,
        series: prevSeries,
        learned: prevLearned,
      } = userWord.optional;

      const newSeries = (isSuccess ? Math.min(prevSeries + 1, 3) : 0) as
        | 0
        | 1
        | 2
        | 3;
      const success = isSuccess ? prevSuccess + 1 : prevSuccess;
      const fail = isSuccess ? prevFail + 1 : prevFail;
      const learned = prevLearned ? isSuccess : newSeries === 3;
      const series = newSeries === 3 ? 0 : newSeries;
      const difficulty = learned ? 'no' : userWord.difficulty;

      const updatedUserWord: IUserWordCreate = {
        difficulty,
        optional: {
          ...userWord.optional,
          success,
          fail,
          series,
          learned,
        },
      };
      updateUserWord({ userId, wordId: w.id, body: updatedUserWord });
    });
  };

  // save statistics

  const [useUpsertUserStats, { isLoading: isUStatsUpdating }] =
    useUpsertUserStatisticMutation();

  const saveStats = () => {
    if (userId === null) return;
    const rightAnswers = gameState.wordsResults.filter((r) => r).length;
    const wrongAnswers = gameState.wordsResults.length - rightAnswers;
    const wordCounter = gameState.words.filter(
      (w) => !userWords?.some(({ wordId }) => wordId === w.id),
    ).length;
    const bestSeries = getBestSeriesCount(gameState.wordsResults, true);
    const createdOn = new Date();
    const currentResult: IResultGame = {
      rightAnswers,
      wrongAnswers,
      wordCounter,
      bestSeries,
      createdOn,
    };
    const prevResults = userStats?.optional;
    const prevGameResults = JSON.parse(userStats?.optional?.audioСall ?? '[]');
    const updatedStats = {
      learnedWords: userStats?.learnedWords || 0,
      optional: {
        ...prevResults,
        audioСall: JSON.stringify([...prevGameResults, currentResult]),
      },
    };
    useUpsertUserStats({ userId, body: updatedStats });
  };

  useEffect(() => {
    if (gameState.state === GameStates.Finished) {
      saveResults();
      saveStats();
    }
  }, [gameState.state]);

  const isLoading = isFetching || gameState.words.length === 0;

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {gameState.state === GameStates.NotStarted ? (
          <GameStart onStart={handleStart}>
            {!gameState.isFromTextbook ? (
              <LevelSelect
                level={gameState.level}
                setLevel={handleLevelSelect}
              />
            ) : null}
          </GameStart>
        ) : null}

        {gameState.state === GameStates.InProgress && isLoading
          ? 'Loading...'
          : null}

        {!isLoading && gameState.state === GameStates.InProgress ? (
          <GameIteraion
            word={gameState.words[gameState.iteration.curIndex]}
            onNextWord={handleNextWord}
            options={gameState.iteration.options}
          />
        ) : null}

        {!isLoading && gameState.state === GameStates.Finished ? (
          <GameFinish
            words={gameState.words.map((word, i) => ({
              ...word,
              result: gameState.wordsResults[i],
            }))}
            onRestart={handleRestart}
            onClose={handleClose}
            isSaving={isUWordCreating || isUWordUpdating || isUStatsUpdating}
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
