import { useState, useEffect } from 'react';
import { IGetWordRes } from '../../../API/types';
import { useGetUserWordsQuery, useGetWordsQuery } from '../../../API/wordsApi';
import { useAppSelector } from '../../../app/hooks';
import { selectUserId } from '../../../features/auth/authSlice';
import { getRandomIntInclusive } from '../Utils/getRandomIntInclusive';

type args = {
  amount: number;
  group: number;
};

export const useGetWordsFromTextBook = ({ amount, group }: args) => {
  const [words, setWords] = useState<IGetWordRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(getRandomIntInclusive(0, 29));
  const userId = useAppSelector(selectUserId)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const {data: userWords} = useGetUserWordsQuery({userId})

  const { data } = useGetWordsQuery({group, page})

  useEffect(() => {
    if (data) {
      const total = [...words, ...data]
      if (total.length < amount) {
        setWords(prev => [...prev, ...data])
        setPage(prev => prev + 1)
      } else {
        setWords(total)
        setIsLoading(false)
      }
    }
  }, [data])
  

  return { words, isLoading };
};
