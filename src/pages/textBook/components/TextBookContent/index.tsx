import { useEffect, useState, useRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './index.scss';
import classNames from 'classnames';
import {
  selectTextBook,
  setLearnedPage,
  removeLearnedPage,
  selectLearnedPages,
} from '../../../../features/textBook/textBook';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {
  useGetUserWordsQuery,
  useGetWordsQuery,
} from '../../../../API/wordsApi';
import { colorsOfLevels } from '../../types';
import { IGetWordRes, IUserWords } from '../../../../API/types';
import { BACKEND_URL } from '../../../../constants';
import { selectCurrentUser } from '../../../../features/auth/authSlice';
import Card from '../Card';

interface ITextBookContent {
  userId: string | null;
}

function TextBookContent({ userId }: ITextBookContent) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [paths, setPaths] = useState<[] | string[]>([]);
  const audio = useRef(new Audio());
  const [learned, setLearned] = useState(false);

  const user = useAppSelector(selectCurrentUser);

  const learnedPages = useAppSelector(selectLearnedPages);
  const path = `${BACKEND_URL}/`;

  const { group, page } = useAppSelector(selectTextBook);
  const { data: userWords = [], isLoading: userWordsLoading } =
    useGetUserWordsQuery(user);
  const { data: words = [], isLoading: wordsLoading } = useGetWordsQuery({
    page,
    group,
  });

  const color: string = colorsOfLevels[group][1];

  const dispatch = useAppDispatch();

  const updateLearnedPages = () => {
    setTimeout(() => {
      const links = document.querySelectorAll('a.page-link');
      const candidat = learnedPages[group];
      links.forEach((el) => {
        const value = el.textContent;
        if (value !== null) {
          const val = Number(el.textContent) - 1;
          if (candidat.includes(val)) {
            el.classList.add('learned-page');
          } else {
            el.classList.remove('learned-page');
          }
        }
      });
    }, 0);
  };

  const checkIsLearnedPage = () => {
    if (userWords.length !== 0) {
      const check = words.every((itemWord: IGetWordRes) => {
        const word = userWords.find(
          (el: IUserWords) => el.wordId === itemWord.id,
        );
        if (word !== undefined) {
          return word.optional.learned;
        }
        return false;
      });
      if (check) {
        dispatch(setLearnedPage({ group, value: page }));
        setLearned(true);
      } else {
        dispatch(removeLearnedPage({ group, value: page }));
        setLearned(false);
      }
    }
    return false;
  };

  useEffect(() => {
    if (userId) {
      checkIsLearnedPage();
      updateLearnedPages();
    }
  }, [words, userWords]);

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

  if (userWordsLoading || wordsLoading)
    return (
      <div className="loading">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  return (
    <div className="page">
      <div
        className={classNames(
          'page__container',
          learned ? 'page__container-learned' : '',
        )}
      >
        {words.length !== 0 ? (
          words.map((item: IGetWordRes) => {
            const userWord = userWords.find(
              (el: IUserWords) => el.wordId === item.id,
            );
            const statistics = { right: 0, wrong: 0 };
            if (userWord) {
              statistics.right = userWord.optional.success;
              statistics.wrong = userWord.optional.fail;
            }

            return (
              <Card
                color={color}
                card={item}
                key={item.id.toString()}
                playAudio={handlerClick}
                stopAudio={stopAudio}
                userId={userId}
                userWords={userWords}
                difficult={userWord !== undefined ? userWord.difficulty : 'no'}
                learned={
                  userWord !== undefined ? userWord.optional.learned : false
                }
                statistics={statistics}
              />
            );
          })
        ) : (
          <div className="loading">
            <h3>Не удалось загрузить список слов</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextBookContent;
