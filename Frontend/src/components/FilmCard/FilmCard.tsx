import { FC } from 'react';
import { IFilmCardProps } from './FilmCard.types';
import { Link } from 'react-router-dom';
import Stars from '../Stars/Stars';
import Like from '../Like/Like';
import WillWatch from '../WillWatch/WillWatch';
import { observer } from 'mobx-react-lite';

const FilmCard: FC<IFilmCardProps> = (props) => {
   const content = props.content;
   const ref = props.refLast && props.refLast;

   return <div className="filmcard-container" ref={ ref }>
      <Link to={`/films/${content.id}`}>
         <div className="film-picture">
            <img 
               src={content.img} 
               alt="" 
               className="film-image"
            />
         </div>
      </Link>
      <Stars id={content.id} rating={content.rating.value} />
      <Link to={`/films/${content.id}`}>
         <div className="film-info-container">
            <div className="film-name">
               <p>{content.name}</p>
            </div>
            <div className="film-info">
               <p>{content.genre}</p>
               <p>{content.year}</p>
            </div>
         </div>      
      </Link>
      <div className="film-options">
         <Like id={content.id} isLiked={content.details?.isLiked} />
         <WillWatch id={content.id} willWatch={content.details?.willWatch} />
      </div>
   </div>
}

export default observer(FilmCard);