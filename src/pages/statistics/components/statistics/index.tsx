import { Row, Col, Container } from 'react-bootstrap';
import { useGetUserStatisticQuery } from '../../../../API/userApi';
import GameStatsCard from '../GameStatsCard';

interface StatisticsProps {
  userId: string;
}

enum Games {
  audioCall = 'audioCall',
  sprint = 'sprint',
}

const gamesData = [
  { id: Games.audioCall, title: 'Аудиовызов' },
  { id: Games.sprint, title: 'Спринт' },
];

function Statistics({ userId }: StatisticsProps) {
  const { data, isLoading } = useGetUserStatisticQuery({ userId });

  return (
    <Container>
      <h2 className="fw-bold">Статистика за сегодня</h2>

      {isLoading || !data ? (
        'Loading...'
      ) : (
        <Row
          xs={1}
          md={2}
          className="mx-auto g-4"
          style={{ maxWidth: '40rem' }}
        >
          {gamesData.map((game) => {
            const gameStats = data.optional.games[game.id];
            return (
              <Col key={`${game.id}-col`}>
                <GameStatsCard
                  key={game.id}
                  gameTitle={game.title}
                  statistics={gameStats}
                />
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default Statistics;
