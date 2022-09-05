/* eslint-disable prefer-arrow-callback */
import { Button } from 'react-bootstrap';
import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { IGetWordRes } from '../../../../API/types';
import { shuffleArray } from '../../../games/Utils/suffleArray';
import SpeakerIcon from '../../../games/assets/icons/speaker.svg';
import { BACKEND_URL } from '../../../../constants';
import GameButton from '../../../audioCallGame/components/GameButton';
import styles from './Game.module.scss';

interface props {
  handleRightAnswer: (answer: IGetWordRes) => void;
  handleWrongAnswer: (answer: IGetWordRes) => void;
  endGame: () => void;
  words: IGetWordRes[];
}

export default memo(function SprintGame({
  endGame,
  words,
  handleRightAnswer,
  handleWrongAnswer,
}: props) {
  const [curItem, setCurItem] = useState(0);
  const [timeLeft, setTimeLeft] = useState(52);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const shuffleWords = useMemo(() => shuffleArray(words), [words]);
  const shuffleWords2 = useMemo(() => shuffleArray(shuffleWords), [shuffleWords]);
  const wordAudioUrl = new URL(
    shuffleWords2[curItem].audio,
    BACKEND_URL,
  ).toString();
  const audio = new Audio(wordAudioUrl);

  const playAudio = () => {
    audio.play();
  };

  const handleNextItem = () => {
    if (curItem >= words.length - 1) endGame();
    setCurItem((prev) => prev + 1);
  };

  
  const handleAnswer = (userAnswer: boolean) => {
    const isWasTrue = shuffleWords[curItem].id === shuffleWords2[curItem].id;
 
    if (userAnswer === isWasTrue) {
      handleRightAnswer(shuffleWords2[curItem]);
    } else {
      handleWrongAnswer(shuffleWords2[curItem]);
    }
    handleNextItem();
  };

  const handleKeyboard = (e: KeyboardEvent) => {
    const { code } = e;

    if (code === 'ArrowRight') {
      handleAnswer(true);
    } else if (code === 'ArrowLeft') {
      handleAnswer(false);
    } else if (code === 'Space') {
      playAudio();
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  }, [])
  

  useEffect(() => {
    window.addEventListener('keyup', handleKeyboard);
    return () => {
      window.removeEventListener('keyup', handleKeyboard);
    };
  });

  useEffect(() => {
    if (timeLeft <= 0) endGame();
  }, [timeLeft]);

  return (
    <div className={styles.container}>
      <h3 className={styles.timer}>{timeLeft}</h3>
      <GameButton
        className={styles.audio}
        onClick={playAudio}
        icon={SpeakerIcon}
        shape="round"
      />
      <h3 className={styles.word}>{shuffleWords2[curItem].word}</h3>
      <h2 className={styles.word2}>{shuffleWords[curItem].wordTranslate}</h2>
      <div className={styles.btns}>
        <Button
          className={styles.btn}
          onClick={() => handleAnswer(false)}
          variant="danger"
        >
          Неверно{' '}
        </Button>{' '}
        <Button
          className={styles.btn}
          onClick={() => handleAnswer(true)}
          variant="success"
        >
          Верно
        </Button>{' '}
      </div>
    </div>
  );
});
