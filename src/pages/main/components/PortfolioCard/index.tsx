import classNames from 'classnames';
import './index.scss';
import { IAboutTeamCard } from '../AboutTeam';
import git from '../../assets/git.svg';

function PortfolioCard({
  name,
  job,
  done,
  ghLink,
  avatarLink,
}: IAboutTeamCard) {
  return (
    <div className={classNames('cards__item', 'item')}>
      <div
        className="item__image"
        style={{
          backgroundImage: `url(${avatarLink})`,
        }}
      />
      <div className="item__info">
        <a href={ghLink} className="item__git-link" target="blank">
          <h4 className="item__name">
            {name} <img src={git} alt="git" className="item__git-image" />
          </h4>
        </a>
        <p className="item__job">{job}</p>
        <p className="item__contribution">На проекте:</p>
        <ul className={classNames('item__contribution-list', 'list')}>
          {done.map((el) => (
            <li key={el[0]} className="list__item">
              {el[1]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PortfolioCard;
