import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useAppSelector } from '../../../../app/hooks';

import { selectPath } from '../../../../features/app/app';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { IGetWordRes, IUserWordCreate } from '../../../../API/types';
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
import { getNewUserWord, shuffle } from '../../utils';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import { GameActions, GameState, GameStates, Word } from '../../types';
import { gameReducer } from './reducer';

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

  const isLoading =
    wordsResp.isUninitialized ||
    wordsResp.isLoading ||
    gameState.words.length === 0;

  console.log(wordsResp, userWordsResp, gameState.words);

  useEffect(() => {
    if (gameState.state !== GameStates.InProgress) return;

    const { isUninitialized, isFetching, data: wordsData } = wordsResp;
    if (isUninitialized || isFetching || !wordsData) return;

    const allWords: IGetWordRes[] = wordsData;

    if (userId !== null && gameState.isFromTextbook) {
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
    console.log(gameState.words);
  }, [wordsResp.data, userWordsResp.data, gameState.state]);

  // save results

  const [createUserWord, { isLoading: isUWCreating }] =
    useCreateUserWordMutation();
  const [updateUserWord, { isLoading: isUWUpdating }] =
    useUpdateUserWordMutation();

  const saveResults = () => {
    if (userId && userWordsResp.data) {
      gameState.words.forEach((w, i) => {
        const isSuccess = gameState.wordsResults[i];
        const userWord = userWordsResp.data?.find((uw) => uw.wordId === w.id);
        if (!userWord) {
          const newUserWord = getNewUserWord(isSuccess);
          createUserWord({ userId, wordId: w.id, body: newUserWord });
          return;
        }

        const success = isSuccess
          ? userWord.optional.success + 1
          : userWord.optional.success;
        const fail = isSuccess
          ? userWord.optional.fail + 1
          : userWord.optional.fail;
        /* eslint-disable no-nested-ternary */
        const series = (
          isSuccess
            ? userWord.optional.series + 1 <= 3
              ? userWord.optional.series + 1
              : 3
            : userWord.optional.series - 1 > 0
            ? userWord.optional.series - 1
            : 0
        ) as 0 | 1 | 2 | 3;
        /* eslint-enable no-nested-ternary */
        const updatedUserWord: IUserWordCreate = {
          difficulty: userWord.difficulty,
          optional: {
            ...userWord.optional,
            success,
            fail,
            series,
          },
        };
        updateUserWord({ userId, wordId: w.id, body: updatedUserWord });
      });
    }
  };

  useEffect(() => {
    if (gameState.state === GameStates.Finished) {
      saveResults();
    }
  }, [gameState.state]);

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
            isSaving={isUWCreating || isUWUpdating}
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
