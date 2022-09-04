import { Button } from 'react-bootstrap';
import s from './Difficult.module.scss';

interface props {
  setDifficult: (e: number) => void;
}

export default function Difficult({ setDifficult }: props) {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const checkColors = (index: number) => {
    switch (index) {
      case 0:
        return 'primary';
      case 1:
        return 'secondary';
      case 2:
        return 'success';
      case 3:
        return 'info';
      case 4:
        return 'warning';
      case 5:
        return 'danger';
      default:
        return 'dark';
    }
  };

  return (
    <>
      <p className={s.title}>Выберите уровень</p>
      <div className={s.btns}>
        {levels.map((level, index) => (
          <Button
            key={level}
            variant={checkColors(index)}
            onClick={() => setDifficult(index)}
          >
            {level}
          </Button>
        ))}
      </div>
    </>
  );
}
