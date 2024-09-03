import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import { ILikeProps } from "./Like.types";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { Context } from '../../index';

const Like: FC<ILikeProps> = ({ id, isLiked }) => {
   const { detailsStore, contentStore, userStore } = useContext(Context);

   const likeHandler = async () => {
      try{
         await detailsStore.setLike('films', id, Number(userStore.user.id))
         contentStore.setIsLiked(id);
      } catch(e) {
         console.log(e);
      }
   }

   return (<>
      {!isLiked
         ? <FcLikePlaceholder 
               style={{cursor: "pointer"}}
               onClick={likeHandler}
           /> 
         : <FcLike 
               style={{cursor: "pointer"}}
               onClick={likeHandler}
           /> 
      }
   </>);
}

export default observer(Like);