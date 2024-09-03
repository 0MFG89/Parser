import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import FilmCard from '../../components/FilmCard/FilmCard';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import ContentService from '../../services/ContentService';
import { MdDownloading } from "react-icons/md";
import Slider from '../../components/Slider/Slider';

const Films: FC = () => {
   const { contentStore, userStore } = useContext(Context);
   const [ loading, setLoading ] = useState<boolean>(true);
   const observer = useRef<IntersectionObserver | null>(null);
   
   const lastFilmRef = useCallback((node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
         if (entries[0].isIntersecting && contentStore.filmsListHasMore) {
            contentStore.setFilmsPage(contentStore.filmsPage+1);
         }
      })
      if (node) observer.current.observe(node);
   }, [loading, contentStore.filmsListHasMore]);

   useEffect(() => {
      setLoading(true);
      contentStore.getFilmsPreviews('films', Number(userStore.user.id));
      setLoading(false);
      return () => ContentService.filmsListCancelToken();
   }, [contentStore.filmsPage, userStore.user.id]);


   return <section className="films-wrapper">
      <Slider />
      <div className="films-container">
         <h2 className="films-title">Фильмы</h2>
         <div className="films">
            {contentStore.filmsList.map((f, index) => {
               if(index === contentStore.filmsList.length-1) {
                  return <FilmCard key={f.name+index} content={f} refLast={lastFilmRef}/>
               } 
               return <FilmCard key={f.name+index} content={f}/>
            })}
         </div>
         {
            loading && <div className="loading">
                           <MdDownloading />
                        </div>
         }
      </div>
   </section>
}

export default observer(Films);