/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '../games/styles/style.scss';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import crossIcon from '../games/assets/icons/cross.svg';
import { IGetWordRes, IUserStatisticsRes } from '../../API/types';
import {
  useGetUserStatisticQuery,
  useUpsertUserStatisticMutation,
} from '../../API/userApi';
import {
  useCreateUserWordMutation,
  useGetUserWordsQuery,
  useUpdateUserWordMutation,
} from '../../API/wordsApi';
import { useAppSelector } from '../../app/hooks';
import { selectUserId } from '../../features/auth/authSlice';
import SprintGame from './components/Game/Game';
import GameResults from '../games/components/GameResults/GameResults';
import GameStartScreen from '../games/components/GameStartScreen/GameStartScreen';
import { useGetWordsWithPrms } from './hooks/useGetWordsWithPrms';
import { useIsFromTextBook } from './hooks/useIsFromTextBook';
import SprintDescription from './components/SprintDescription/SprintDescription';
import { GetDefaultStatiscitObj } from './Utils/GetDefaultStatiscitObj';
import { getObjToCreateUserWord } from './Utils/getObjToCreateUserWord';
import { getObjToUpdateUserWord } from './Utils/getObjToUpdateUserWord';
import GetStatisticObj from './Utils/GetStatisticObj';
import GameButton from '../audioCallGame/components/GameButton';
import DelayLoader from '../games/components/DelayLoader/DelayLoader';

const CorrectSound = require(`../games//assets/audio/correct-choice.mp3`);
const WrongSound = require(`../games//assets/audio/wrong-choice.mp3`);

function SprintGamePage() {
  const [group, setGroup] = useState(0);
  const navigate = useNavigate();
  const isFromTextBook = useIsFromTextBook();
  const { group: dictionaryGroup } = useAppSelector((state) => state.textBook);
  const userId = useAppSelector(selectUserId);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [rightAnswers, setRightAnswers] = useState<IGetWordRes[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IGetWordRes[]>([]);
  const [series, setSeries] = useState(0);
  const [addUserWord] = useCreateUserWordMutation();
  const [updateUserWord] = useUpdateUserWordMutation();
  const {
    data: stat = {} as IUserStatisticsRes,
    isLoading: isStatLoading,
    isError: isStatEror,
  } = useGetUserStatisticQuery({ userId }, { skip: !userId });
  const [addStat, { isLoading: isSaving }] = useUpsertUserStatisticMutation();
  const { data: userWords = [], isLoading: isUserWordsLoading } =
    useGetUserWordsQuery(
      { userId },
      { skip: !userId, refetchOnMountOrArgChange: true },
    );
  const { words, isLoading: isWordsLoading } = useGetWordsWithPrms({
    amount: 20,
    group,
    skip: !isGameStarted || isUserWordsLoading,
    isFromTextBook,
    userWords,
  });
  const [newWords, setNewWord] = useState(0);

  useEffect(() => {
    if (isStatEror) {
      const body = GetDefaultStatiscitObj();
      addStat({ userId, body });
    }
  }, [isStatEror]);

  const playAudio = (isGood: boolean) => {

    const audioPath = isGood ? CorrectSound : WrongSound;
    const audio = new Audio(audioPath);
    audio.play();
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  const endGame = () => {
    setIsGameEnded(true);
    const body = GetStatisticObj({
      bestSeries: series,
      gameName: 'sprint',
      newWords,
      rightAnswers: rightAnswers.length,
      stat,
      wrongAnswers: wrongAnswers.length,
    });
    addStat({ userId, body });
  };

  const startGameAgain = () => {
    setIsGameStarted(false);
    setIsGameEnded(false);
    setRightAnswers([]);
    setWrongAnswers([]);
    setSeries(0);
  };


  const handleRightAnswer = (word: IGetWordRes) => {
    setRightAnswers((prev) => [...prev, word]);
    setSeries((prev) => prev + 1);
    playAudio(true)

    if (userId) {
      const userWord = userWords.find(
        (userWord) => userWord.wordId === word.id,
      );
     
      if (userWord) {
        const body = getObjToUpdateUserWord({ userWord, answer: 'right' });
        updateUserWord({ userId, wordId: word.id, body });
      } else {
        setNewWord(prev => prev + 1)
        addUserWord({
          userId,
          wordId: word.id,
          body: getObjToCreateUserWord(true),
        });
      }
    }
  };

  const handleWrongAnswer = (word: IGetWordRes) => {
    setWrongAnswers((prev) => [...prev, word]);
    setSeries(0);
    playAudio(false)

    if (userId) {
      const userWord = userWords.find(
        (userWord) => userWord.wordId === word.id,
      );

      if (userWord) {
        const body = getObjToUpdateUserWord({ userWord, answer: 'wrong' });
        updateUserWord({ userId, wordId: word.id, body });
      } else {
        setNewWord(prev => prev + 1)
        addUserWord({
          userId,
          wordId: word.id,
          body: getObjToCreateUserWord(false),
        });
      }
    }
  };

  const toHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (isFromTextBook) setGroup(dictionaryGroup);
  }, [isFromTextBook]);

  const isLoading = isWordsLoading || isStatLoading;

  if (isGameEnded)
    return (
      <div className="audio-call-game">
        <div className="audio-call-game__container">
          <GameResults
            {...{
              rightAnswers,
              wrongAnswers,
              startGameAgain,
              toHome,
              isSaving,
            }}
          />
        </div>
      </div>
    );

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {isGameStarted ? (
          <DelayLoader isLoading={isLoading}>
            <SprintGame
              {...{
                endGame,
                handleRightAnswer,
                handleWrongAnswer,
              }}
              words={words}
            />
          </DelayLoader>
        ) : (
          <GameStartScreen
            {...{ isFromTextBook, startGame }}
            setDifficult={setGroup}
            description={<SprintDescription />}
          />
        )}
      </div>
      <GameButton
        className="audio-call-game__close-btn"
        onClick={toHome}
        icon={crossIcon}
        shape="square"
      />
    </div>
  );
}

export default SprintGamePage;
