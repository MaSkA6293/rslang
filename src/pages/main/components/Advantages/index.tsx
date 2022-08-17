import classNames from 'classnames';
import './index.scss';
import AdvantageCard from '../AdvantageCard';

export interface IAdvantageCard {
  id: number;
  title: string;
  text: string;
  img: string;
}

function Advantages() {
  const cards: IAdvantageCard[] = [
    {
      id: 0,
      title: 'Учебник',
      text: 'Коллекция содержит 3600 самых часто употребляемых английских слов!',
      img: './images/advantage-textbook.svg',
    },
    {
      id: 1,
      title: 'Словарь',
      text: 'Создай свой электронный словарь! Добавляй слова прямо из Учебника!',
      img: './images/advantage-glossary.svg',
    },
    {
      id: 2,
      title: 'Игры',
      text: 'Игра Аудиовызов поможет улучшить навыки аудирования, a Спринт добавит обучению интерактива',
      img: './images/advantage-game.svg',
    },
    {
      id: 3,
      title: 'Статистика',
      text: 'Следи за своим прогрессом! Регулярные тренировки - залог успеха!',
      img: './images/advantage-statistic.svg',
    },
  ];

  const cardList = cards.map((el: IAdvantageCard) => (
    <AdvantageCard
      key={el.id.toString()}
      id={el.id}
      title={el.title}
      text={el.text}
      img={el.img}
    />
  ));

  return (
    <section className="advantages">
      <h3 className="advantages__title">
        Используй весь функционал приложения!
      </h3>
      <div className={classNames('advantages__cards', 'cards')}>{cardList}</div>
    </section>
  );
}

export default Advantages;
