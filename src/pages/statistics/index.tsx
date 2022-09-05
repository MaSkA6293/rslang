import { useEffect } from 'react';
import { useGetUserStatisticQuery, useUpsertUserStatisticMutation } from '../../API/userApi';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { getTimeToday, makeDefaultDayStat, makeStartedDefaultStat } from '../../hooks/statHelper';
import DelayLoader from '../games/components/DelayLoader/DelayLoader';
import Statistics from './components/statistics';
import './index.scss';

function StatisticsPage() {
  const { userId } = useAppSelector(selectCurrentUser);
  const {data: stat = makeStartedDefaultStat(), isLoading, isFetching, error} = useGetUserStatisticQuery({userId})
  const [updateStat] = useUpsertUserStatisticMutation()
  
 useEffect(() => {
  const date = getTimeToday()
  if (!isLoading && (error || !stat)) {
    if (error) updateStat({userId, body: makeStartedDefaultStat()})
    if (stat && !Object.keys(stat.optional).includes(date)) {
      const body = makeDefaultDayStat({stat})
      updateStat({userId, body})
    }
  }
 }, [isLoading])
 
  
  if (!userId) return <h1>Страница доступна только авторизованным пользователям</h1>
  return (
    <DelayLoader error={error ? 'Error' : ''} isLoading={isFetching}>
      <Statistics {...{stat}} />
    </DelayLoader>  
  ) 
}

export default StatisticsPage;
