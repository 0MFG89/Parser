import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from '../../index';
import FilmDescribtionResponse from "../../models/response/FilmDescribtionResponse";

const FilmDescribtion: FC = () => {
   const params = useParams<{filmId: string}>();
   const { contentStore } = useContext(Context);
   const { img, name, genre, about, duration, filmYear, age } = contentStore.filmDescribtion;


   useEffect(() => {
      contentStore.getFilmDescribtion('films', params.filmId);
      return contentStore.setFilmDescribtion({} as FilmDescribtionResponse);
   }, [])

   console.log('Film Describtion render');

   return <section className="film-describtion-container">
      <div className="film-about-wrapper">
         <div className="film-image-container">
            <img src={img} alt={name} className="film-image" />
         </div>
         <div className="film-about-container">
            <div className="film-describtion-name">
               <p>{name}</p>
            </div>
            <div className="film-genre-container">
               <p>Жанр:</p>
               <div className="film-genres">
                  {genre && genre.split(', ').map(g => <div key={g} className="film-genre">
                     <p>{g}</p>
                  </div>)}
               </div>
            </div>
            <div className="film-about">
               <p style={{fontWeight: "bold"}}>
                  О фильме:
               </p>
               <div className="film-about-info">
                  { about }
               </div>
            </div>
            <div className="film-infoItems">
               <div className="film-infoItem">
                  <p style={{fontWeight: "bold"}}>
                     Длительность
                  </p>
                  <div className="film-duration">
                     {duration}
                  </div>
               </div>
               <div className="film-infoItem">
                  <p style={{fontWeight: "bold"}}>
                     Год выпуска
                  </p>
                  <div className="film-year">
                     {filmYear}
                  </div>
               </div>
               <div className="film-infoItem">
                  <p style={{fontWeight: "bold"}}>
                     Возрастное ограничение
                  </p>
                  <div className="film-age">
                     {age}
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>
}

export default observer(FilmDescribtion);