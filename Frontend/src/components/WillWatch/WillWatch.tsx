import { FC, useContext } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import { Context } from '../../index';
import { observer } from "mobx-react-lite";
import { IWillWatchProps } from "./WillWatch.type";

const WillWatch: FC<IWillWatchProps> = ({ id, willWatch }) => {
   const { userStore, detailsStore, contentStore } = useContext(Context);
   const willWatchHandler = async () => {
      try{
         await detailsStore.setWillWatch('films', id, Number(userStore.user.id))
         contentStore.setWillWatch(id);
      } catch(e) {
         console.log(e);
      }
   }

   return (<>
      {
         !willWatch
            ? <RiBookmarkLine 
                  style={{color: "#FADADD", cursor: "pointer"}}
                  onClick={willWatchHandler}
            />
            : <RiBookmarkFill 
                  style={{cursor: "pointer"}}
                  onClick={willWatchHandler}
            />
      }
   </>)
}

export default observer(WillWatch);