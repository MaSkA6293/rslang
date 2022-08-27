import { selectCurrentUser } from '../../features/auth/authSlice';
import { useAppSelector } from '../../app/hooks';
import Statistics from './components/statistics';
import './index.scss';

function StatisticsPage() {
  const { userId } = useAppSelector(selectCurrentUser);
  return userId ? (
    <Statistics userId={userId} />
  ) : (
    <div>Статистика доступна только для авторизованных пользователей</div>
  );
}

export default StatisticsPage;
