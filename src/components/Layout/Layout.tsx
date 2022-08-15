import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './index.scss';

export default function Layout() {
  return (
    <div className="wrapper">
      <div className="header">
        <Header />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
