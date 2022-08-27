import { useEffect, useState, useRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import classNames from 'classnames';
import './index.scss';
import { User } from '../../../../features/auth/authSlice';
import { useAppSelector } from '../../../../app/hooks';
import { colorsOfLevels } from '../../types';
import { selectTextBook } from '../../../../features/textBook/textBook';
import { BACKEND_URL } from '../../../../constants';
import { IGetWordRes, IUserWords } from '../../../../API/types';
import { getWordById, getUserWords } from '../../../../API/wordsApiCRU';
import Card from '../Card';

interface IDifficultWords {
  user: User;
  handlerActions: (
    wordId: string,
    action: 'difficult' | 'learned',
  ) => Promise<boolean>;
}

function DifficultWords({ user, handlerActions }: IDifficultWords) {
  const [words, setWords] = useState<IGetWordRes[]>([]);
  const [userWords, setUserWords] = useState<[] | IUserWords[]>([]);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [paths, setPaths] = useState<[] | string[]>([]);

  const { group } = useAppSelector(selectTextBook);

  const userId = user.userId ? user.userId : '';
  const token = user.token ? user.token : '';
  const audio = useRef(new Audio());
  const path = `${BACKEND_URL}/`;
  const color: string = colorsOfLevels[group][1];

  useEffect(() => {
    getUserWords(userId, token).then((data) => {
      setUserWords(data);
      const wordsPromice = data
        .filter((el: any) => el.difficulty !== 'no')
        .map((el: any) => new Promise((res) => res(getWordById(el.wordId))));
      Promise.all<any>(wordsPromice).then((dataProm) => {
        setWords(dataProm);
        setIsLoading(false);
      });
    });
  }, [needToUpdate]);

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

  const handlerAudio = (paths: string[]) => setPaths(paths);

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

  const handlerClick = async (
    word: string,
    action: 'difficult' | 'learned',
  ): Promise<boolean> => {
    const result = await handlerActions(word, action);
    if (result) {
      setNeedToUpdate((needToUpdate) => !needToUpdate);
    }
    return result;
  };

  if (isLoading)
    return (
      <div className="loading">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="page">
      <div className={classNames('page__container', 'difficult-words')}>
        {words.length !== 0 ? (
          words.map((item: IGetWordRes) => {
            const difficulty = 'yes';
            const learned = userWords.find((el) => el.wordId === item.id)
              ?.optional.learned;
            return (
              <Card
                color={color}
                card={item}
                key={item.id.toString()}
                playAudio={handlerAudio}
                stopAudio={stopAudio}
                userId={userId}
                handlerActions={handlerClick}
                difficult={difficulty}
                learned={learned !== undefined ? learned : false}
              />
            );
          })
        ) : (
          <div className="difficult-words__no-words">
            <h3 className="difficult-words__title">
              Добавьте в этот раздел сложные слова
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default DifficultWords;
