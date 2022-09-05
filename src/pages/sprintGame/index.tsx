/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IGetWordRes } from '../../API/types';
import { useGetUserStatisticQuery, useUpsertUserStatisticMutation } from '../../API/userApi';
import {
  useCreateUserWordMutation,
  useGetUserWordsQuery,
  useUpdateUserWordMutation
} from '../../API/wordsApi';
import { useAppSelector } from '../../app/hooks';
import { selectUserId } from '../../features/auth/authSlice';
import { changeStatByLearnedWord, getTimeToday, makeDayDafaultStat, makeDefaultDayStat, makeStartedDefaultStat, updateStatWithPrms } from '../../hooks/statHelper';
import GameButton from '../audioCallGame/components/GameButton';
import crossIcon from '../games/assets/icons/cross.svg';
import DelayLoader from '../games/components/DelayLoader/DelayLoader';
import GameResults from '../games/components/GameResults/GameResults';
import GameStartScreen from '../games/components/GameStartScreen/GameStartScreen';
import '../games/styles/style.scss';
import SprintGame from './components/Game/Game';
import SprintDescription from './components/SprintDescription/SprintDescription';
import { useGetWordsWithPrms } from '../games/hooks/useGetWordsWithPrms';
import { useIsFromTextBook } from '../games/hooks/useIsFromTextBook';
import { getObjToCreateUserWord } from '../games/Utils/getObjToCreateUserWord';
import { getObjToUpdateUserWord } from '../games/Utils/getObjToUpdateUserWord';

const CorrectSound = require(`../games//assets/audio/correct-choice.mp3`);
const WrongSound = require(`../games//assets/audio/wrong-choice.mp3`);

function SprintGamePage() {
  const gameName = 'sprint'
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
  
  const { data: userWords = [], isLoading: isUserWordsLoading } =
    useGetUserWordsQuery(
      { userId },
      { skip: !userId, refetchOnMountOrArgChange: true },
    );
  const { words, isLoading: isWordsLoading } = useGetWordsWithPrms({
    amount: 10,
    group,
    skip: !isGameStarted || isUserWordsLoading,
    isFromTextBook,
    userWords,
  });

  const [updateStat] = useUpsertUserStatisticMutation()
  const {data: stat, error: statError, isLoading: isStatLoading} = useGetUserStatisticQuery({userId}, {skip: !userId})

  useEffect(() => {
    const date = getTimeToday()
    if (!isStatLoading && (statError || !stat)) {
      if (statError) updateStat({userId, body: makeStartedDefaultStat()})
      if (stat && !Object.keys(stat.optional).includes(date)) {
        const body = makeDefaultDayStat({stat})
        updateStat({userId, body})
      }
    }
   }, [isStatLoading])

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
    if (userId && stat) {
      updateStat({userId, body: updateStatWithPrms({gameName, stat, series})})
    }
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
      let learnedStatus = 'default'
      const userWord = userWords.find(
        (userWord) => userWord.wordId === word.id,
      );
     
      if (userWord) {
        const [choice, body] = getObjToUpdateUserWord({ userWord, answer: 'right' });
        learnedStatus = choice
        updateUserWord({ userId, wordId: word.id, body });
      } else {
        addUserWord({
          userId,
          wordId: word.id,
          body: getObjToCreateUserWord(true),
        });
      }

      if (stat) {
        let newstat = stat
        if (learnedStatus === 'learned') {
          newstat = changeStatByLearnedWord({stat: newstat, isToDelete: false, learnedWordId: word.id})
        } else if (learnedStatus === 'unlearned') {
          newstat = changeStatByLearnedWord({stat: newstat, isToDelete: true, learnedWordId: word.id})
        }
        newstat = updateStatWithPrms({stat: newstat, gameName, wordId: word.id, isRight: true} )
        updateStat({userId, body: newstat})
      }
    }
  };

  const handleWrongAnswer = (word: IGetWordRes) => {
    setWrongAnswers((prev) => [...prev, word]);
    setSeries(0);
    playAudio(false)

    if (userId) {
      let learnedStatus = 'default'
      const userWord = userWords.find(
        (userWord) => userWord.wordId === word.id,
      );

      if (userWord) {
        const [choice, body] = getObjToUpdateUserWord({ userWord, answer: 'wrong' });
        learnedStatus = choice
        updateUserWord({ userId, wordId: word.id, body });
      } else {
        addUserWord({
          userId,
          wordId: word.id,
          body: getObjToCreateUserWord(false),
        });
      }
        
      if (stat) {
        let newstat = stat
        if (learnedStatus === 'learned') {
          newstat = changeStatByLearnedWord({stat: newstat, isToDelete: false, learnedWordId: word.id})
        } else if (learnedStatus === 'unlearned') {
          newstat = changeStatByLearnedWord({stat: newstat, isToDelete: true, learnedWordId: word.id})
        }
        newstat = updateStatWithPrms({stat: newstat, gameName, wordId: word.id, isRight: false} )
        updateStat({userId, body: newstat})
      }
    }
  };

  const toHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (isFromTextBook) setGroup(dictionaryGroup);
  }, [isFromTextBook]);

  const isLoading = isWordsLoading || isStatLoading as boolean;

  if (isGameEnded)
    return (
      <div className="audio-call-game">
        <div className="audio-call-game__container">
          <GameResults
            {...{
              rightAnswers,
              wrongAnswers,
              startGameAgain,
              toHome
            }}
          />
        </div>
      </div>
    );

  return (
    <div className="audio-call-game">
      <div className="audio-call-game__container">
        {isGameStarted ? (
          <DelayLoader error={!words.length ? 'Вы перешли с учебника, все слова на странице изучены, поменяйте страницу или зайдите с главного меню.' : ''} isLoading={isLoading}>
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
