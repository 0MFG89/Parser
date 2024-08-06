import { FC } from 'react';
import './MainLayout.scss';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const MainLayout: FC = () => {
   return <>
      <Header />
      <Outlet />
      <Footer />
   </>
}

export default observer(MainLayout);