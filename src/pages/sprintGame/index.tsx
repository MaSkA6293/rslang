import { useEffect, useMemo, useState } from 'react';
import { IGetWordRes } from '../../API/types';
import { useGetUserWordsQuery } from '../../API/wordsApi';
import { useAppSelector } from '../../app/hooks';
import { selectUserId } from '../../features/auth/authSlice';
import Game from './components/Game/Game';
import GameResults from './components/GameResults/GameResults';
import GameStartScreen from './components/GameStartScreen/GameStartScreen';
import { useGetWordsWithPrms } from './hooks/useGetWordsWithPrms';
import { useIsFromTextBook } from './hooks/useIsFromTextBook';
import './index.scss';

function SprintGamePage() {
  const [group, setGroup] = useState(0);
  const isFromTextBook = useIsFromTextBook();
  const {group: dictionaryGroup} = useAppSelector(state => state.textBook)
  const userId = useAppSelector(selectUserId)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [rightAnswers, setRightAnswers] = useState<IGetWordRes[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IGetWordRes[]>([]);
  const {data: userWords = [], isLoading: isUserWordsLoading} = useGetUserWordsQuery({userId}, {skip: !userId})
  const {words, isLoading: isWordsLoading} = useGetWordsWithPrms({amount: 140, group, skip: !isGameStarted || isUserWordsLoading, isFromTextBook, userWords})

  const startGame = () => {
    setIsGameStarted(true);
  };

  const endGame = () => {
    setIsGameEnded(true);
  };

  const handleRightAnswer = (word: IGetWordRes) => {
    setRightAnswers((prev) => [...prev, word]);
  };

  const handleWrongAnswer = (word: IGetWordRes) => {
    setWrongAnswers((prev) => [...prev, word]);
  };

  useEffect(() => {
    if (isFromTextBook) setGroup(dictionaryGroup)
  }, [isFromTextBook])
 
  const isDataLoading = useMemo(() => isWordsLoading || !words.length, [isWordsLoading, words])


  if (isGameEnded) return <GameResults {...{rightAnswers, wrongAnswers}} />;

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
