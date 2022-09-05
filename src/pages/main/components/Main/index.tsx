import './index.scss';
import MainTitle from '../MainTitle';
import Advantages from '../Advantages';
import AboutTeam from '../AboutTeam';

function Main() {
  return (
    <div className="main-page">
      <div className="main-page__container">
        <MainTitle />
        <Advantages />
        <AboutTeam />
      </div>
    </div>
  );
}

export default Main;
