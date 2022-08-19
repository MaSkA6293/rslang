import './index.scss';
import classNames from 'classnames';

export default function TeamGitLinks() {
  return (
    <ul className={classNames('footer__team', 'team')}>
      <li className={classNames('team__item', 'item')}>
        <div className="footer__git-img" />
      </li>
      <li className={classNames('team__item', 'item')}>
        <a
          href="https://github.com/npwsk"
          className="item__link"
          target="blank"
        >
          Nika
        </a>
      </li>
      <li className={classNames('team__item', 'item')}>
        <a
          href="https://github.com/Jokernics"
          className="item__link"
          target="blank"
        >
          Egor
        </a>
      </li>
      <li className={classNames('team__item', 'item')}>
        <a
          href="https://github.com/MaSkA6293"
          className="item__link"
          target="blank"
        >
          Oleg
        </a>
      </li>
    </ul>
  );
}
