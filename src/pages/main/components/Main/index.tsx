import './index.scss';
import MainTitle from '../MainTitle';
import Advantages from '../Advantages';

function Main() {
  return (
    <div className="main-page">
      <div className="main-page__container">
        <MainTitle />
        <Advantages />
      </div>
    </div>
  );
}

export default Main;
