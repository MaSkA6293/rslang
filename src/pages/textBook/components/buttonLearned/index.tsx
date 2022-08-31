import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface IButtonLearned {
  handlerClick: (wordId: string, action: 'difficult' | 'learned') => void;
  learned: boolean;
  wordId: string;
  loading: boolean;
}

function ButtonLearned({
  handlerClick,
  wordId,
  learned,
  loading,
}: IButtonLearned) {
  if (loading) {
    return (
      <Button
        variant={learned ? 'success' : 'warning'}
        className="action__difficult-word"
        aria-label="add-difficult-words"
        onClick={() => handlerClick(wordId, 'learned')}
        disabled
      >
        {' '}
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span className="visually-hidden">Loading...</span>
        {learned ? 'Изучено' : 'Не изучено'}
      </Button>
    );
  }
  return (
    <Button
      variant={learned ? 'success' : 'warning'}
      className="action__difficult-word"
      aria-label="add-difficult-words"
      onClick={() => handlerClick(wordId, 'learned')}
    >
      {learned ? 'Изучено' : 'Не изучено'}
    </Button>
  );
}

export default ButtonLearned;
