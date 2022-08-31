import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useAppSelector } from '../../../../app/hooks';

import { selectPath } from '../../../../features/app/app';
import { selectTextBook } from '../../../../features/textBook/textBook';
import {
  IGetWordRes,
  IResultGame,
  IUserStatisticsRes,
  IUserWordCreate,
  IUserWords,
} from '../../../../API/types';
import {
  useCreateUserWordMutation,
  useGetUserWordsQuery,
  useGetWordsQuery,
  useUpdateUserWordMutation,
} from '../../../../API/wordsApi';

import GameStart from '../GameStart';
import GameIteraion from '../GameIteration';
import GameFinish from '../GameFinish';
import GameButton from '../GameButton';
import LevelSelect from '../LevelSelect';

import './index.scss';
import CrossIcon from '../../assets/icons/cross.svg';
import { getBestSeriesCount, getNewUserWord, shuffle } from '../../utils';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import { GameActions, GameState, GameStates, Word } from '../../types';
import { gameReducer } from './reducer';
import {
  useGetUserStatisticQuery,
  useUpsertUserStatisticMutation,
} from '../../../../API/userApi';

const initialGameState: GameState = {
  level: 0,
  page: 0,
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

  const initGame = (words: Word[]) => {
    dispatch({ type: GameActions.Initialize, payload: { words } });
  };

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

  // check if run from texbook

  const path = useAppSelector(selectPath);
  const textbookState = useAppSelector(selectTextBook);

  useEffect(() => {
    if (path === '/textbook') {
      const { group, page } = textbookState;
      dispatch({
        type: GameActions.SetFromTextbook,
        payload: { level: group, page },
      });
    }
  }, []);

  // get words

  const wordsQParams = { page: gameState.page, group: gameState.level };
  const wordsResp = useGetWordsQuery(wordsQParams);
  const userWordsResp = useGetUserWordsQuery(userId ? { userId } : skipToken);
  const userStatsResp = useGetUserStatisticQuery(
    userId ? { userId } : skipToken,
  );
  const { data: allWords } = wordsResp;
  const { data: userWords } = userWordsResp;
  const { data: userStats } = userStatsResp;

  const isFetching =
    wordsResp.isUninitialized ||
    wordsResp.isFetching ||
    userWordsResp.isFetching ||
    userStatsResp.isFetching;

  const pickGameWords = (
    allWordsOnPage: IGetWordRes[],
    userWords: IUserWords[],
  ) => {
    // filter learned words
    const filteredWords = allWordsOnPage.filter((w) => {
      const uWord = userWords.find((uw) => w.id === uw.wordId);
      return !uWord || uWord?.optional.learned === false;
    });

    const words = shuffle(filteredWords).slice(0, 10);
    return words;
  };

  useEffect(() => {
    if (gameState.state !== GameStates.InProgress) return;
    if (isFetching) return;
    if (!allWords) return;

    if (userId !== null && gameState.isFromTextbook) {
      const pickedWords = pickGameWords(allWords, userWords || []);
      initGame(pickedWords);
    } else {
      const words = shuffle(allWords).slice(0, 10);
      initGame(words);
    }
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
    const wordCounter = gameState.words.filter((w) =>
      userWords?.some(({ wordId }) => wordId === w.id),
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
    const prevResults = userStats?.optional || {};
    const updatedStats: IUserStatisticsRes = {
      ...userStats,
      learnedWords: userStats?.learnedWords || 0,
      optional: {
        ...prevResults,
        audioСall: [...(prevResults.audioСall || []), currentResult],
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
                setLevel={(level) => {
                  dispatch({
                    type: GameActions.ChangeLevel,
                    payload: { level },
                  });
                }}
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
