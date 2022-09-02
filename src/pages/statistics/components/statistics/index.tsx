/* eslint-disable */
import { Row, Col, Container } from 'react-bootstrap';
import { useGetUserStatisticQuery } from '../../../../API/userApi';
import GameStatsCard from '../GameStatsCard';
import LTStatsChart from '../LTStatsChart';
import StatsCard from '../StatsCard';
import { useEffect, useState } from 'react';
import { getPrcntStr, isDateWithinToday, parseGameResult } from '../../utils';
import { GamesIds, IGameStats, IStats } from '../../types';

interface StatisticsProps {
  userId: string;
}

const GAME_IDS = Object.values(GamesIds);

const GAME_TITLES = {
  [GamesIds.audioCall]: 'Аудиовызов',
  [GamesIds.sprint]: 'Спринт',
};

const initialGameStats: Omit<IGameStats, 'id'> = {
  newWords: 0,
  rightAnswers: 0,
  totalAnswers: 0,
  bestSeries: 0,
};

const initialStats: IStats = {
  today: {
    newWords: 0,
    rightAnswers: 0,
    totalAnswers: 0,
  },
  games: [
    { id: GamesIds.audioCall, ...initialGameStats },
    { id: GamesIds.sprint, ...initialGameStats },
  ],
};

function Statistics({ userId }: StatisticsProps) {
  const { data, isLoading } = useGetUserStatisticQuery({ userId });

  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const gamesStats = GAME_IDS.map((id) => {
      const allResults = data?.optional[id]
        ? parseGameResult(data.optional[id] as string)
        : [];
      console.log(allResults);
      const todayResults = allResults.filter((result) =>
        isDateWithinToday(result.createdOn),
      );
      const todayNewWords = todayResults
        .map((result) => result.wordCounter)
        .reduce((sum, count) => sum + count, 0);
      const todayTotalAnswers = todayResults
        .map((result) => result.rightAnswers + result.wrongAnswers)
        .reduce((sum, answers) => sum + answers, 0);
      const todayRightAnswers = todayResults
        .map((result) => result.rightAnswers)
        .reduce((sum, right) => sum + right, 0);
      const todayBestSeries = Math.max(
        ...todayResults.map((result) => result.bestSeries),
      );
      console.log(todayResults.map((result) => result.bestSeries));
      const todayStats = {
        newWords: todayNewWords,
        rightAnswers: todayRightAnswers,
        totalAnswers: todayTotalAnswers,
        bestSeries: isFinite(todayBestSeries) ? todayBestSeries : 0,
      };
      return { id, ...todayStats };
    });

    const accTodayNewWords = gamesStats
      .map((data) => data.newWords)
      .reduce((sum, newWords) => sum + newWords, 0);

    const accTodayRightAnswers = gamesStats
      .map((data) => data.rightAnswers)
      .reduce((sum, right) => sum + right, 0);

    const accTodayTotalAnswers = gamesStats
      .map((data) => data.totalAnswers)
      .reduce((sum, answers) => sum + answers, 0);

    setStats({
      games: gamesStats,
      today: {
        newWords: accTodayNewWords,
        rightAnswers: accTodayRightAnswers,
        totalAnswers: accTodayTotalAnswers,
      },
    });
  }, [data, userId]);

  return (
    <Container>
      <h2 className="fw-bold my-5">Статистика за сегодня</h2>

      {isLoading || !data ? (
        'Loading...'
      ) : (
        <>
          <Row
            xs={1}
            md={2}
            lg={3}
            className="mx-auto g-4 mb-5 justify-content-center"
            style={{ maxWidth: '62rem' }}
          >
            <Col>
              <StatsCard title="Новых слов">{stats.today.newWords}</StatsCard>
            </Col>

            <Col>
              <StatsCard title="Изучено слов">{0}</StatsCard>
            </Col>

            <Col>
              <StatsCard title="Правильных ответов">
                {getPrcntStr(
                  stats.today.rightAnswers,
                  stats.today.totalAnswers,
                )}
              </StatsCard>
            </Col>
          </Row>

          <Row
            xs={1}
            md={2}
            className="mx-auto mb-5 g-4"
            style={{ maxWidth: '40rem' }}
          >
            {stats.games.map((game) => {
              return (
                <Col key={`${game.id}_stats-col`}>
                  <GameStatsCard
                    key={`${game.id}_stats-card`}
                    id={game.id}
                    title={GAME_TITLES[game.id]}
                    stats={game}
                  />
                </Col>
              );
            })}
          </Row>

          <Row className="justify-content-center">
            {/* <LTStatsChart data={ltStats} /> */}
          </Row>
        </>
      )}
    </Container>
  );
}

export default Statistics;
