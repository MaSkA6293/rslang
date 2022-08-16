import './index.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Container from './components/container';
import StartScreen from './components/startScreen';

function AudioCallGamePage() {
  return (
    <>
      <Header />
      <Container>
        <StartScreen />
      </Container>
      <Footer />
    </>
  );
}

export default AudioCallGamePage;
