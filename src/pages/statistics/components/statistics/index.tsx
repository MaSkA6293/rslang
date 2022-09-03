import { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import { useGetUserStatisticQuery } from '../../../../API/userApi';
import GameStatsCard from '../GameStatsCard';
import LTStatsChart from '../LTStatsChart';
import StatsCard from '../StatsCard';

import { GameResult, GamesIds, IGameStats, IStats } from '../../types';
import {
  aggregateGameResults,
  getDateRange,
  getDayString,
  getPrcntStr,
  parseGameResult,
} from '../../utils';

interface StatisticsProps {
  userId: string;
}

const GAME_IDS = Object.values(GamesIds);

const GAME_TITLES = {
  [GamesIds.audioCall]: 'Аудиовызов',
  [GamesIds.sprint]: 'Спринт',
};

const defaultGameStats: Omit<IGameStats, 'id'> = {
  newWords: 0,
  rightAnswers: 0,
  totalAnswers: 0,
  bestSeries: 0,
};

const initialDayStats = {
  date: getDayString(new Date()),
  learnedWords: 0,
  ...aggregateGameResults([]),
};

const initialStats: IStats = {
  today: {
    newWords: 0,
    rightAnswers: 0,
    totalAnswers: 0,
  },
  games: [
    { id: GamesIds.audioCall, ...defaultGameStats },
    { id: GamesIds.sprint, ...defaultGameStats },
  ],
  wordsStatsByDay: [initialDayStats],
};

function Statistics({ userId }: StatisticsProps) {
  const { data, isFetching, isError } = useGetUserStatisticQuery(
    { userId },
    { refetchOnMountOrArgChange: true },
  );

  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    if (isFetching || isError) return;

    const results: GameResult[] = GAME_IDS.flatMap((id) => {
      const allResults = data?.optional[id]
        ? parseGameResult(data.optional[id] as string)
        : [];
      return allResults.map((result) => ({ gameId: id, ...result }));
    });

    const startDate = new Date(
      Math.min(...results.map(({ createdOn }) => createdOn.valueOf())),
    );

    const today = new Date();

    const dateRange = getDateRange(startDate, today);

    const resultsByDate = dateRange.reduce((storage, date) => {
      storage[date] = storage[date] || [];
      const resultsForDate = results.filter(
        ({ createdOn }) => getDayString(createdOn) === date,
      );
      storage[date].push(...resultsForDate);
      return storage;
    }, {} as Record<string, GameResult[]>);

    const todayStr = getDayString(today);
    const todayResults = resultsByDate[todayStr] ?? [];

    const todayGamesStats = GAME_IDS.map((id) => {
      const gameResults = todayResults.filter((result) => result.gameId === id);
      return { id, ...aggregateGameResults(gameResults) };
    });

    const todayWordsStats = aggregateGameResults(todayResults);

    const wordsStatsByDay = Object.entries(resultsByDate).map(
      ([date, results]) => {
        const learnedWords = 0;
        return { date, learnedWords, ...aggregateGameResults(results) };
      },
    );
    console.log(wordsStatsByDay);

    setStats({
      games: todayGamesStats,
      today: {
        newWords: todayWordsStats.newWords,
        rightAnswers: todayWordsStats.rightAnswers,
        totalAnswers: todayWordsStats.totalAnswers,
      },
      wordsStatsByDay,
    });
  }, [data, userId]);

  return (
    <Container>
      {isFetching ? (
        'Loading...'
      ) : (
        <>
          <section>
            <h2 className="fw-bold my-5">Статистика за сегодня</h2>
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
              {stats.games.map((game) => (
                <Col key={`${game.id}_stats-col`}>
                  <GameStatsCard
                    key={`${game.id}_stats-card`}
                    id={game.id}
                    title={GAME_TITLES[game.id]}
                    stats={game}
                  />
                </Col>
              ))}
            </Row>
          </section>

          <section>
            <h2 className="fw-bold my-5">Статистика за все время</h2>
            <Row
              className="justify-content-center px-3 mx-auto"
              style={{ maxWidth: '40rem' }}
            >
              <LTStatsChart
                metric="newWords"
                title="Новых слов"
                data={stats.wordsStatsByDay}
              />
            </Row>
          </section>
        </>
      )}
    </Container>
  );
}

export default Statistics;
