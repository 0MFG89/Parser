import { FC, useContext } from "react";
import { Context } from '../../index';
import { SlideItemProps } from "./Slider.types";
import { observer } from "mobx-react-lite";
import Like from '../Like/Like';
import WillWatch from "../WillWatch/WillWatch";
import Stars from '../Stars/Stars';
import Error401 from "../Error401/Error401";

const SlideItem: FC<SlideItemProps> = ({ id }) => {
   const { userStore, detailsStore, contentStore } = useContext(Context);
   const content = contentStore.sliderContent;
   const slide = content?.find(item => item.id === id);

   const parseVoices = (voices: number) => {
      return voices === 0 
               ? 'нет голосов'
               : voices === 1 
                  ? voices + ' голос'
                  : voices && voices > 1 && voices < 5
                     ? voices + ' голоса'
                     : voices + ' голосов'
   };
   const img = () => slide && <img src={ slide.img } alt="Loading..." className="slide-image" />;
   const stars = () => slide && <Stars id={id} rating={slide.rating.value}/>
   const voices = () => slide && parseVoices(slide?.rating?.voices);
   const options = () => slide && 
         <>
            <Like id={id} isLiked={slide?.details?.isLiked} />
            <WillWatch id={id} willWatch={slide?.details?.willWatch} />
         </>;
   
   return <>
      <div className="slide-info">
         <span className="slide-name">
            { slide?.name }
         </span>
         <span className="slide-year">
            { slide?.year }
         </span>
      </div>
      <div className="slide-ratings">
         <div className="slide-rating">
            { slide?.rating?.value?.toFixed(1) }
         </div>
         <div className="slide-stars">
            { 
               detailsStore.unauthorizedErrorRating && 
               <Error401 /> 
            }
            { stars() }
         </div>
         <div className="slide-voices">
            { voices() }
         </div>
         <div className="slide-likes">
            { 
               (detailsStore.unauthorizedErrorLike ||
               detailsStore.unauthorizedErrorWillWatch) && 
               <Error401 /> 
            }
            { options() }
         </div>
      </div>
      { img() }       
   </>
}

export default observer(SlideItem);