import { FC, useContext, useState } from "react";
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import Login from '../Login/Login';
import Registration from '../Registration/Registration';
import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";

const LoginModal: FC = () => {
   const [state, setState] = useState<string>('login');
   const { statesStore } = useContext(Context);

   console.log('Modal render');

   return createPortal(
      <div className="modal">
         <div className="modal-container">
            <div className="modal-buttons">
               <button 
                  onClick={() => state !== 'login' && setState('login')}
                  className="modal-login"
               >
                  ВХОД
               </button>
               <button 
                  onClick={() => state !== 'registration' && setState('registartion')}
                  className="modal-registration"
               >
                  РЕГИСТРАЦИЯ
               </button>
            </div>
            <div className="modal-close" onClick={() => statesStore.setIsModal(false)}>
               <AiOutlineClose />
            </div>
            <div className="modal-content">
               {state === 'login' 
                  ? <Login /> 
                  : <Registration />}
            </div>
         </div>
      </div>
   , document.getElementById('modal')!)
}
export default observer(LoginModal);