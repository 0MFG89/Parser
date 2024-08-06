import { DOMElement, FC, useRef, useState } from 'react';
import './FilmCard.scss';
import { observer } from 'mobx-react-lite';
import { IFilmCardProps } from '../../pages/Films/Films.types';
import { Link } from 'react-router-dom';

const FilmCard: FC<IFilmCardProps> = (props) => {
   const content = props.content;

   return <div className="filmcard-container">
      <Link to={`/films/${content.id}`}>
         <div className="film-picture">
            <img 
               src={content.img} 
               alt="" 
               className="film-image"
            />
         </div>
         <div className="film-info-container">
            <div className="film-name">
               <p>{content.filmName}</p>
            </div>
            <div className="film-info">
               <p>{content.genre}</p>
               <p>{content.filmYear}</p>
            </div>
         </div>
      </Link>
   </div>
}

export default observer(FilmCard);