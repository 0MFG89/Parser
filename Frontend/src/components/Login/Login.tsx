import React, { FC, useContext, useState } from "react";
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import './Login.scss';
import { AiOutlineUser, AiFillLock } from "react-icons/ai";

const Login: FC = () => {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const { userStore, statesStore } = useContext(Context);

   const checkLoginErrors = () => {
      if (userStore.error && 
         userStore.error.message === `Пользователь не был найден`) {
         return true;
      }
      return false;
   }

   const checkPasswordErrors = () => {
      if (userStore.error && 
         userStore.error.message === 'Некорректный пароль') {
         return true;
      }
      return false;
   }

   return (
   <div className="login-container">
      <div className="login-modal">
         { 
            checkLoginErrors() && <p className="modal-error">
               Пользователь с таким email не был найден
            </p>
         }
         <div className="modal-input">
            <input 
               onChange={e => setEmail(e.target.value)}
               value={email}
               type='text'
               className="login-mail"
            />
            <p className="modal-placeholder">
               E-mail
            </p>
            <div className="modal-inputicon">
               <AiOutlineUser />
            </div>
         </div>
         { 
            checkPasswordErrors() && <p className="modal-error">
               Некорректный пароль
            </p>
         }
         <div className="modal-input">
            
            <input 
               onChange={e => setPassword(e.target.value)}
               value={password}
               type='password'
               className="login-password"
            />
            <p className="modal-placeholder">
               Пароль
            </p>
            <div className="modal-inputicon">
               <AiFillLock />
            </div>
         </div>
         <button 
            onClick={async () => {
               await userStore.login(email, password);
               userStore.user.email && statesStore.setIsModal(false);
            }}
            className="button-login"
         >
            ВОЙТИ
         </button>
      </div>
   </div>
   )
}

export default observer(Login);