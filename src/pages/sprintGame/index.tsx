/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { IGetWordRes } from '../../API/types';
import { useGetUserStatisticQuery } from '../../API/userApi';
import { useCreateUserWordMutation, useGetUserWordsQuery, useUpdateUserWordMutation } from '../../API/wordsApi';
import { useAppSelector } from '../../app/hooks';
import { selectUserId } from '../../features/auth/authSlice';
import Game from './components/Game/Game';
import GameResults from './components/GameResults/GameResults';
import GameStartScreen from './components/GameStartScreen/GameStartScreen';
import { useGetWordsWithPrms } from './hooks/useGetWordsWithPrms';
import { useIsFromTextBook } from './hooks/useIsFromTextBook';
import './index.scss';
import { createUserWord } from './Utils/createUserWord';
import { getObjToUpdateUserWord } from './Utils/getObjToUpdateUserWord';

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
  const {data: statistic, isLoading: isStatLoading, isError: isStatEror} = useGetUserStatisticQuery({userId}, {skip: !userId})
  const {data: userWords = [], isLoading: isUserWordsLoading} = useGetUserWordsQuery({userId}, {skip: !userId, refetchOnMountOrArgChange: true})
  const {words, isLoading: isWordsLoading} = useGetWordsWithPrms({amount: 20, group, skip: !isGameStarted || isUserWordsLoading, isFromTextBook, userWords})

  
  const startGame = () => {
    setIsGameStarted(true);
  };

  const endGame = () => {
    setIsGameEnded(true);
  };

  const startGameAgain = () => {
    setIsGameStarted(false)
    setIsGameEnded(false)
    setRightAnswers([])
    setWrongAnswers([])
    setSeries(0)
  }

  const handleRightAnswer = async (word: IGetWordRes) => {
    setRightAnswers((prev) => [...prev, word]);
    setSeries(prev => prev + 1)
    
    if (userId) {
      const userWord = userWords.find((userWord) => userWord.wordId === word.id)
      
      if (userWord) {
        const body = getObjToUpdateUserWord({userWord, answer: 'right',})
        updateUserWord({userId, wordId: word.id, body})
      } else {
        addUserWord({userId, wordId: word.id, body: createUserWord(true)})
      }
    }
  };

  const handleWrongAnswer = async (word: IGetWordRes) => {
    setWrongAnswers((prev) => [...prev, word]);
    setSeries(0)

    if (userId) {
      const userWord = userWords.find((userWord) => userWord.wordId === word.id)

      if (userWord) {
        const body = getObjToUpdateUserWord({userWord, answer: 'wrong',})
        updateUserWord({userId, wordId: word.id, body})
      } else {
        addUserWord({userId, wordId: word.id, body: createUserWord(false)})
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
