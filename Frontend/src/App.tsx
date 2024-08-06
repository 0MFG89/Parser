import React, { useEffect, useContext, FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import Header from './components/Header/Header';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import rtr from './router/router';

const App: FC = () => {
  const { userStore } = useContext(Context);
  const router = rtr;
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      userStore.checkAuth();
    }
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default observer(App);
