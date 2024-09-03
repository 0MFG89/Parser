import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/user-store/userStore';
import ContentStore from './store/content-store/contentStore';
import './index.scss';
import StatesStore from './store/states-store/statesStore';
import DetailsStore from './store/content-store/details-store';

interface State {
  userStore: UserStore;
  contentStore: ContentStore;
  statesStore: StatesStore;
  detailsStore: DetailsStore;
}

const userStore = new UserStore();
const contentStore = new ContentStore();
const statesStore = new StatesStore();
const detailsStore = new DetailsStore();

export const Context = createContext<State>({
  userStore, contentStore, statesStore, detailsStore
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Context.Provider value={{userStore, contentStore, statesStore, detailsStore}}>
    <App />
  </Context.Provider>
);
