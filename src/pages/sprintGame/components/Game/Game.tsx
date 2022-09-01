/* eslint-disable prefer-arrow-callback */
import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { IGetWordRes } from '../../../../API/types';
import { shuffleArray } from '../../Utils/suffleArray';

interface props {
  handleRightAnswer: (answer: IGetWordRes) => void;
  handleWrongAnswer: (answer: IGetWordRes) => void;
  endGame: () => void;
  words: IGetWordRes[];
  isLoading: boolean;
}

export default memo(function Game({
  endGame,
  words,
  isLoading,
  handleRightAnswer,
  handleWrongAnswer,
}: props) {
  const [curItem, setCurItem] = useState(0);
  const [timeLeft, setTimeLeft] = useState(61);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const shuffleWords = useMemo(() => shuffleArray(words), [words]);


  const handleNextItem = () => {
    if (curItem >= words.length - 1) endGame();
    setCurItem((prev) => prev + 1);
  };

  const handleAnswer = (userAnswer: boolean) => {
    const shuffleWord = shuffleWords[curItem].word;
    const { word } = words[curItem];
    const isWasTrue = shuffleWord === word;

    if (userAnswer === isWasTrue) {
      handleRightAnswer(words[curItem]);
    } else {
      handleWrongAnswer(words[curItem]);
    }

    handleNextItem();
  };

  useEffect(() => {
    if (!isLoading) {
      timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    }
  }, [isLoading]);

  useEffect(() => {
    if (timeLeft <= 0) endGame();
  }, [timeLeft]);

  if (isLoading) return <p>'Loading...'</p>;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {timeLeft}
      <div>{words[curItem].word}</div>
      <div>{shuffleWords[curItem].wordTranslate}</div>
      <div style={{ display: 'flex' }}>
        <button onClick={() => handleAnswer(true)}>Верно</button>
        <div style={{ width: 5 }}> </div>
        <button onClick={() => handleAnswer(false)}>Неверно</button>
      </div>
    </div>
  );
});
