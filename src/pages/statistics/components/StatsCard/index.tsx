import React from 'react';
import { Card } from 'react-bootstrap';

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
}

function StatsCard({ title, children }: StatsCardProps) {
  return (
    <Card className="h-100 my-0" style={{ width: '18rem' }}>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-3">{title}</Card.Title>
        <div className="fs-1 fw-bold my-auto">{children}</div>
      </Card.Body>
    </Card>
  );
}

export default StatsCard;
