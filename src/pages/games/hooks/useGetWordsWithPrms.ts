import { useEffect, useMemo, useState } from 'react';
import { IGetWordRes, IUserWords } from '../../../API/types';
import { useGetWordsQuery } from '../../../API/wordsApi';
import { useAppSelector } from '../../../app/hooks';
import { getArrayWithRandom } from '../Utils/getArrayWithRandom';

type prms = {
  amount: number;
  group: number;
  skip: boolean;
  isFromTextBook: boolean;
  userWords: IUserWords[];
};

export function useGetWordsWithPrms({
  amount,
  group,
  skip,
  isFromTextBook,
  userWords,
}: prms) {
  const pagesRandom = useMemo(() => getArrayWithRandom(30), []);
  const { page: dictionaryPage } = useAppSelector((state) => state.textBook);
  const [pageIndex, setPageIndex] = useState(0);
  const [words, setWords] = useState<IGetWordRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(pagesRandom[pageIndex]);
  const { data } = useGetWordsQuery({ group, page }, { skip });

  const learnedWords = useMemo(
    () => userWords.filter((word) => word.optional.learned),
    [userWords],
  );

  const filterData = useMemo(() => {
    if (!data || !data.length) return [];
    if (!isFromTextBook) return data;
    return data.filter((word) =>
      learnedWords.length === 0
        ? true
        : !learnedWords.some((userWord) => userWord.wordId === word.id),
    );
  }, [data]);

  useEffect(() => {
    const total = [...words, ...filterData];
    const isPagesEnd =
      pageIndex >= pagesRandom.length - 1 || (isFromTextBook && page <= 0);
    if (total.length < amount && !isPagesEnd) {
      setWords(total);
      if (isFromTextBook) {
        setPage((prev) => prev - 1);
      } else {
        setPage(pagesRandom[pageIndex + 1]);
        setPageIndex((prev) => prev + 1);
      }
    } else {
      setWords(total);
      setIsLoading(false);
    }
  }, [filterData]);

  useEffect(() => {
    setPage(dictionaryPage);
  }, [isFromTextBook]);

  return { words, isLoading };
}
