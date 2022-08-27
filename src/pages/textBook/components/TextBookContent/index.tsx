import { useEffect, useState, useRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './index.scss';
import classNames from 'classnames';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { useAppSelector } from '../../../../app/hooks';
import { getUserWords, getWords } from '../../../../API/wordsApiCRU';
import { colorsOfLevels } from '../../types';
import { IGetWordRes, IUserWords } from '../../../../API/types';
import { BACKEND_URL } from '../../../../constants';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import Card from '../Card';

interface ITextBookContent {
  userId: string | null;
  handlerActions: (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => Promise<boolean>;
}

function TextBookContent({ userId, handlerActions }: ITextBookContent) {
  const [userWords, setUserWords] = useState<[] | IUserWords[]>([]);
  const [words, setWords] = useState<[] | IGetWordRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [paths, setPaths] = useState<[] | string[]>([]);
  const audio = useRef(new Audio());

  const user = useAppSelector(selectCurrentUser);
  const { group, page } = useAppSelector(selectTextBook);

  const path = `${BACKEND_URL}/`;
  const color: string = colorsOfLevels[group][1];

  useEffect(() => {
    const userId = user.userId ? user.userId : '';
    const token = user.token ? user.token : '';
    Promise.all([
      getUserWords(userId, token),
      getWords(page, group, token),
    ]).then((data: [IUserWords[], IGetWordRes[]]) => {
      setUserWords(data[0]);
      setWords(data[1]);
      setIsLoading(false);
    });
  }, [group, page]);

  const playAudioWord = (audioPath: string[]) => {
    let i = 0;
    audio.current.src = path + audioPath[i];
    setIsPlaying((isPlaying) => !isPlaying);
    audio.current.play();
    audio.current.onended = () => {
      if (i + 1 < audioPath.length) {
        i += 1;
        audio.current.src = path + audioPath[i];
        audio.current.play();
      } else setIsPlaying((isPlaying) => !isPlaying);
    };
  };

  const handlerClick = (paths: string[]) => setPaths(paths);

  useEffect(() => {
    if (paths.length !== 0) {
      if (isPlaying) {
        audio.current.pause();
        audio.current.currentTime = 0;
        playAudioWord(paths);
      } else {
        playAudioWord(paths);
      }
    }
  }, [paths]);

  const stopAudio = () => {
    audio.current.pause();
    audio.current.currentTime = 0;
  };

  useEffect(
    () => () => {
      stopAudio();
    },
    [],
  );

  if (isLoading)
    return (
      <div className="loading">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="page">
      <div className={classNames('page__container')}>
        {words.length !== 0
          ? words.map((item: IGetWordRes) => {
              const difficult = userWords.find((el) => el.wordId === item.id);
              return (
                <Card
                  color={color}
                  card={item}
                  key={item.id.toString()}
                  playAudio={handlerClick}
                  stopAudio={stopAudio}
                  userId={userId}
                  handlerActions={handlerActions}
                  difficult={
                    difficult !== undefined ? difficult.difficulty : 'no'
                  }
                  learned={
                    difficult !== undefined ? difficult.optional.learned : false
                  }
                />
              );
            })
          : ''}
      </div>
    </div>
  );
}

export default TextBookContent;
