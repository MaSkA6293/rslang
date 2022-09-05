import classNames from 'classnames';
import './index.scss';

interface IProgress {
  right: number;
  wrong: number;
  series: number;
}

function Progress({ right, wrong, series }: IProgress) {
  let process = 0;
  if (right > 0) {
    process = Math.round((right * 100) / (right + wrong));
  }

  return (
    <ul className="progress__list">
      <li className={classNames('progress__item', 'progress__item-right')}>
        Угадано <span className="progress__value">{right}</span>{' '}
      </li>
      <li className={classNames('progress__item', 'progress__item-wrong')}>
        Не угадано <span className="progress__value">{wrong}</span>
      </li>
      <li className={classNames('progress__item', 'progress__item-progress')}>
        Прогресс <span className="progress__value">{process}%</span>
      </li>
      <li className={classNames('progress__item', 'progress__item-progress')}>
        Серия <span className="progress__value">{series}</span>
      </li>
    </ul>
  );
}
export default Progress;
