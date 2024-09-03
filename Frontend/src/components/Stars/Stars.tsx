import { FC, useContext, useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import { Context } from '../../index';
import { observer } from "mobx-react-lite";

const Stars: FC<{ id: number, rating: number}> = ({ id, rating }) => {
   const { detailsStore, contentStore, userStore } = useContext(Context);
   const [stars, setStars] = useState(0);
   if (id === 36) console.log(rating)
   
   const ratingChanged = async (newRating: number) => {
      try{
         await detailsStore.setRating('films', id, Number(userStore.user.id), newRating)
         contentStore.setRating(id, newRating);  
      } catch(e: any) {
         console.log(e);
      }   
   }

   return (<>
         <StarRatings
            rating={ rating }
            starRatedColor="#f34a23"
            changeRating={ratingChanged}
            numberOfStars={5}
            name='rating'
            starDimension="2rem"
         />
   </>)
}

export default observer(Stars);