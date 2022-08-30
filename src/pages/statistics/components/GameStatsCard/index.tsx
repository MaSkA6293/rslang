import { Card, ListGroup } from 'react-bootstrap';
import { IGameStatistics } from '../../../../API/types';

interface GameStatsCardProps {
  gameTitle: string;
  statistics: IGameStatistics | undefined;
}

const today = new Date().toISOString().slice(0, 10);

const defaultStats: IGameStatistics = {
  date: today,
  newWords: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  bestSeries: 0,
};

function GameStatsCard({ gameTitle, statistics }: GameStatsCardProps) {
  const stats =
    statistics && statistics.date === today ? statistics : defaultStats;

  const correctAnswers =
    Math.round((stats.correctAnswers / stats.totalAnswers) * 100) || 0;

  const statsData = [
    { id: 'newWords', text: 'Новых слов', value: stats.newWords },
    {
      id: 'correctAnswers',
      text: 'Правильных ответов',
      value: `${correctAnswers}%`,
    },
    {
      is: 'bestSeries',
      text: 'Самая длинная серия правильных ответов',
      value: stats.bestSeries,
    },
  ];

  return (
    <Card className="h-100 my-0" style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title className="fw-bold">{gameTitle}</Card.Title>
        <ListGroup variant="flush">
          {statsData.map((data) => (
            <ListGroup.Item
              key={`${gameTitle}${data.id}`}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="text-muted text-start">{data.text}:</div>
              <span className="fw-bold text-muted">{data.value}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default GameStatsCard;
