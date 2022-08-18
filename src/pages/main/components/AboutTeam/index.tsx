import classNames from 'classnames';
import './index.scss';
import PortfolioCard from '../PortfolioCard';

export interface IAboutTeamCard {
  id: number;
  name: string;
  job: string;
  done: [id: number, text: string][];
  ghLink: string;
  avatarLink: string;
}

function AboutTeam() {
  const cards: IAboutTeamCard[] = [
    {
      id: 0,
      name: 'Nika',
      job: 'Developer',
      done: [
        [0, 'Cоздала игру Аудиовызов'],
        [1, 'Реализовала компонент Статистика'],
      ],
      ghLink: 'https://github.com/npwsk',
      avatarLink: './images/avatar-female.svg',
    },
    {
      id: 1,
      name: 'Egor',
      job: 'Developer',
      done: [
        [0, 'Реализовал компонент авторизация'],
        [1, 'Cоздал игру Спринт'],
      ],
      ghLink: 'https://github.com/Jokernics',
      avatarLink: './images/avatar-male-1.svg',
    },
    {
      id: 2,
      name: 'Oleg',
      job: 'Developer',
      done: [
        [0, 'Реализовал главную страницу'],
        [1, 'Cоздал раздел Учебник'],
      ],
      ghLink: 'https://github.com/MaSkA6293',
      avatarLink: './images/avatar-male-2.svg',
    },
  ];

  const cardList = cards.map((el: IAboutTeamCard) => (
    <PortfolioCard
      key={el.id.toString()}
      id={el.id}
      name={el.name}
      job={el.job}
      done={el.done}
      ghLink={el.ghLink}
      avatarLink={el.avatarLink}
    />
  ));

  return (
    <section className="about-team">
      <h3 className="about-team__title">О команде</h3>
      <div className={classNames('about-team__cards', 'cards')}>{cardList}</div>
    </section>
  );
}

export default AboutTeam;
