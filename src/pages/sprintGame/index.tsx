import { useState } from 'react';
import { IGetWordRes } from '../../API/types';
import { useGetWordsQuery } from '../../API/wordsApi';
import Game from './components/Game/Game';
import GameResults from './components/GameResults/GameResults';
import GameStartScreen from './components/GameStartScreen/GameStartScreen';
import { useIsFromTextBook } from './hooks/useIsFromTextBook';
import './index.scss';

function SprintGamePage() {
  const [group, setGroup] = useState(0);
  const isFromTextBook = useIsFromTextBook();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [rightAnswers, setRightAnswers] = useState<IGetWordRes[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<IGetWordRes[]>([]);
  const { data: words = [], isLoading: isWordsLoading } = useGetWordsQuery(
    { group, page: 0 },
    { skip: !isGameStarted },
  );

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

  if (isGameEnded) return <GameResults {...{rightAnswers, wrongAnswers}} />;

  return (
    <div>
      {isGameStarted ? (
        <Game
          {...{
            endGame,
            isWordsLoading,
            handleRightAnswer,
            handleWrongAnswer,
          }}
          words={words.slice(0, 5)}
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
