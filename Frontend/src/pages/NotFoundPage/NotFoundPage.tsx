import { FC } from "react"
import './NotFoundPage.scss';
import { observer } from "mobx-react-lite";

const NotFoundPage: FC = () => {
   return <div className="notfound-container" >
      404 NOT FOUND
   </div>
}

export default observer(NotFoundPage);