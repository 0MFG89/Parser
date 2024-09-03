import { FC } from "react";
import CSS from 'csstype';

const Error401: FC = () => {
   
   return (
      <div className="error-401">
         <p>Данная функция доступна для авторизованных пользователей</p>
      </div>
   )
}

export default Error401;