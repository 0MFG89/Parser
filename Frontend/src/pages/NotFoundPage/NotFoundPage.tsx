import { FC } from "react"
import { observer } from "mobx-react-lite";

const NotFoundPage: FC = () => {
   return <div className="notfound-container" >
      404 NOT FOUND
   </div>
}

export default observer(NotFoundPage);