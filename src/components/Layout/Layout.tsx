import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './index.scss';

export default function Layout() {
  const gamesPath = ['/audioCall', '/sprint'];
  const { pathname } = useLocation();
  const isGame = gamesPath.some((path) => path === pathname);

  return (
    <div className="wrapper">
      <div className="header">
        <Header />
      </div>
      <div className="content">
        <Outlet />
      </div>
      {!isGame && (
        <div className="footer">
          <Footer />
        </div>
      )}
    </div>
  );
}
