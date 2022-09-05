import './index.scss';
import Year from './components/Year';
import TeamGitLinks from './components/TeamGitLinks';
import RSLogo from './components/RSLogo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <Year />
        <TeamGitLinks />
        <RSLogo />
      </div>
    </footer>
  );
}
