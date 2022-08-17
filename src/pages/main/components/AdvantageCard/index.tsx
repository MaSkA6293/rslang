import classNames from 'classnames';
import './index.scss';
import { IAdvantageCard } from '../Advantages';

function AdvantageCard({ title, text, img }: IAdvantageCard) {
  return (
    <div className={classNames('cards__item', 'item')}>
      <div
        className="item__image"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />
      <h4 className="item__title">{title}</h4>
      <p className="item__subtitle">{text}</p>
    </div>
  );
}

export default AdvantageCard;
