/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { IGetWordRes, IUserStatisticsRes } from '../../API/types';
import { useGetUserStatisticQuery, useUpsertUserStatisticMutation } from '../../API/userApi';
import { useCreateUserWordMutation, useGetUserWordsQuery, useUpdateUserWordMutation } from '../../API/wordsApi';
import { useAppSelector } from '../../app/hooks';
import { selectUserId } from '../../features/auth/authSlice';
import Game from './components/Game/Game';
import GameResults from './components/GameResults/GameResults';
import GameStartScreen from './components/GameStartScreen/GameStartScreen';
import { useGetWordsWithPrms } from './hooks/useGetWordsWithPrms';
import { useIsFromTextBook } from './hooks/useIsFromTextBook';
import './index.scss';
import checkIsWordNew from './Utils/checkIsWordNew';
import { GetDefaultStatiscitObj } from './Utils/GetDefaultStatiscitObj';
import { getObjToCreateUserWord } from './Utils/getObjToCreateUserWord';
import { getObjToUpdateUserWord } from './Utils/getObjToUpdateUserWord';
import GetStatisticObj from './Utils/GetStatisticObj';

function SprintGamePage() {
  const [group, setGroup] = useState(0);
  const isFromTextBook = useIsFromTextBook();
  const {group: dictionaryGroup} = useAppSelector(state => state.textBook)
  const userId = useAppSelector(selectUserId)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [rightAnswers, setRightAnswers] = useState<IGetWordRes[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IGetWordRes[]>([]);
  const [series, setSeries] = useState(0)
  const [addUserWord] = useCreateUserWordMutation()
  const [updateUserWord] = useUpdateUserWordMutation()
  const {data: stat = {} as IUserStatisticsRes, isLoading: isStatLoading, isError: isStatEror} = useGetUserStatisticQuery({userId}, {skip: !userId})
  const [addStat] = useUpsertUserStatisticMutation()
  const {data: userWords = [], isLoading: isUserWordsLoading} = useGetUserWordsQuery({userId}, {skip: !userId, refetchOnMountOrArgChange: true})
  const {words, isLoading: isWordsLoading} = useGetWordsWithPrms({amount: 20, group, skip: !isGameStarted || isUserWordsLoading, isFromTextBook, userWords})
  const [newWords, setNewWord] = useState<string[]>([]) 

  useEffect(() => {
    if (isStatEror) {
      const body = GetDefaultStatiscitObj()
      addStat({userId, body})
    }
  }, [isStatEror])
  
  
  const startGame = () => {
    setIsGameStarted(true);
  };

  const endGame = () => {
    setIsGameEnded(true);
    console.log('sf')
    const body = GetStatisticObj({bestSeries: series, gameName: 'sprint', newWords, rightAnswers: rightAnswers.length, stat, wrongAnswers: wrongAnswers.length})
    addStat({userId, body})
  };

  const startGameAgain = () => {
    setIsGameStarted(false)
    setIsGameEnded(false)
    setRightAnswers([])
    setWrongAnswers([])
    setSeries(0)
  }

  const checkNewWord = ({wordId}: {wordId: string}) => {
    const isWordNew = checkIsWordNew({stat, wordId})
    if (isWordNew) setNewWord(prev => [...prev, wordId])
  }

  const handleRightAnswer = (word: IGetWordRes) => {
    setRightAnswers((prev) => [...prev, word]);
    setSeries(prev => prev + 1)
    
    if (userId) {
      const userWord = userWords.find((userWord) => userWord.wordId === word.id)
      checkNewWord({wordId: word.id})
      if (userWord) {
        const body = getObjToUpdateUserWord({userWord, answer: 'right',})
        updateUserWord({userId, wordId: word.id, body})
      } else {
        addUserWord({userId, wordId: word.id, body: getObjToCreateUserWord(true)})
      }
    }
  };

  const handleWrongAnswer = (word: IGetWordRes) => {
    setWrongAnswers((prev) => [...prev, word]);
    setSeries(0)

    if (userId) {
      const userWord = userWords.find((userWord) => userWord.wordId === word.id)

      checkNewWord({wordId: word.id})

      if (userWord) {
        const body = getObjToUpdateUserWord({userWord, answer: 'wrong',})
        updateUserWord({userId, wordId: word.id, body})
      } else {
        addUserWord({userId, wordId: word.id, body: getObjToCreateUserWord(false)})
      }
    }
  };

  useEffect(() => {
    if (isFromTextBook) setGroup(dictionaryGroup)
  }, [isFromTextBook])
 
  const isDataLoading = useMemo(() => isWordsLoading || !words.length, [isWordsLoading, words])


  if (isGameEnded) return <GameResults {...{rightAnswers, wrongAnswers, startGameAgain}} />;

  return (
    <div>
      {isGameStarted ? (
        <Game
          {...{
            endGame,
            handleRightAnswer,
            handleWrongAnswer,
          }}
          words={words}
          isLoading={isDataLoading}
        />
      ) : (
        <GameStartScreen
          {...{ isFromTextBook, startGame }}
          difficult={group}
          setDifficult={setGroup}
          description="asdasd"
          name="sprint"
        />
      )}
    </div>
  );
}

export default SprintGamePage;
