import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface IButtonDifficult {
  handlerClick: (wordId: string, action: 'difficult' | 'learned') => void;
  difficulty: 'yes' | 'no';
  wordId: string;
  loading: boolean;
}

function ButtonDifficult({
  handlerClick,
  wordId,
  difficulty,
  loading,
}: IButtonDifficult) {
  if (loading) {
    return (
      <Button
        variant={difficulty === 'yes' ? 'danger' : 'success'}
        className="action__difficult-word"
        aria-label="add-difficult-words"
        onClick={() => handlerClick(wordId, 'difficult')}
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
        {difficulty === 'yes' ? 'Сложное' : 'Не сложное'}
      </Button>
    );
  }
  return (
    <Button
      variant={difficulty === 'yes' ? 'danger' : 'success'}
      className="action__difficult-word"
      aria-label="add-difficult-words"
      onClick={() => handlerClick(wordId, 'difficult')}
    >
      {difficulty === 'yes' ? 'Сложное' : 'Не сложное'}
    </Button>
  );
}

export default ButtonDifficult;
