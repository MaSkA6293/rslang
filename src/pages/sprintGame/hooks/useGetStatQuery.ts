import { useEffect } from 'react';
import { useGetUserStatisticQuery, useUpsertUserStatisticMutation } from "../../../API/userApi";
import { selectUserId } from '../../../features/auth/authSlice';
import { useAppSelector } from "../../../app/hooks";
import { makeDayDafaultStat, makeStartedDefaultStat } from "../../../hooks/statHelper";


export function useGetStatQuery() {
  type Ierror = {originalStatus: number}
  const userId = useAppSelector(selectUserId)
  const {data = makeDayDafaultStat(), isError: isStatError, error, isLoading: isStatLoading} = useGetUserStatisticQuery({userId}, {skip: !userId})
  const [updateStat] = useUpsertUserStatisticMutation()

  useEffect(() => {
    if ((error as Ierror)?.originalStatus === 404) updateStat({userId, body: makeStartedDefaultStat()})
  }, [error])
  

  return [data, updateStat, isStatError, isStatLoading]
}