import { FC, useContext, useMemo } from 'react';
import './Films.scss';
import FilmCard from '../../components/FilmCard/FilmCard';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';

const Films: FC = () => {
   const { contentStore } = useContext(Context);

   useMemo(() => {
      contentStore.getFilmsPreviews('films');
   }, []);

   return <div className="films-container">
      <h2 className="films-title">Фильмы</h2>
      <div className="films">
         {contentStore.filmsList.map(f => {
           return <FilmCard key={f.id} content={f}/>
         })}
      </div>
   </div>
}

export default observer(Films);