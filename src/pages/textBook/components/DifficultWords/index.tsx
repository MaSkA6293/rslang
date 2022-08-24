import classNames from 'classnames';
import './index.scss';

function DifficultWords() {
  return (
    <div className={classNames('text-book__dictionary', 'dictionary')}>
      <div>Нет слов</div>
    </div>
  );
}

export default DifficultWords;
