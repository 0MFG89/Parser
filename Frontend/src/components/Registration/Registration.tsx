import { FC, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';

const Registration: FC = () => {
   const { userStore, statesStore } = useContext(Context);
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [repeatPassword, setRepeatPassword] = useState<string>('');

   const checkEmailErrors = () => {
      if (userStore.error.errors && 
         userStore.error.errors.filter(e => e.path === 'email').length) {
         return true;
      }
      return false;
   };

   const checkLoginErrors = () => {
      if (userStore.error && 
         userStore.error.message === `Пользователь с email ${email} уже существует`) {
         return true;
      }
      return false;
   };

   const checkRepeatPasswordErrors = () => {
      if (userStore.error && 
         userStore.error.message === 'Пароли не совпадают') {
         return true;
      }
      return false;
   };

   const checkPasswordErrors = () => {
      if (userStore.error.errors && 
         userStore.error.errors.filter(e => e.path === 'password').length) {
         return true;
      }
      return false;
   };

   console.log('Registration render');

   return (
      <div className="registration-container">
         <div className="registration-modal">
            { 
               checkLoginErrors() ? <p className="modal-error">
                  Пользователь с таким email уже существует
               </p> : checkEmailErrors() && <p className="modal-error">
                  Введен некорректный email
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
            </div>
            { 
               checkPasswordErrors() 
               ? <p className="modal-error">
                  Пароль недостаточно сложный
               </p>
               : checkRepeatPasswordErrors() && <p className="modal-error">
                  Пароли не совпадают
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
            </div>
            <div className="modal-input">
               <input 
                  onChange={e => setRepeatPassword(e.target.value)}
                  value={repeatPassword}
                  type='password'
                  className="login-password"
               />
               <p className="modal-placeholder">
                  Повторите пароль
               </p>
            </div>
            <button 
               onClick={async () => {
                  await userStore.registration(email, password, repeatPassword) && statesStore.setIsModal(false);
               }}
               className="button-registration"
            >
               РЕГИСТРАЦИЯ
            </button>
         </div>
      </div>
   )
}

export default observer(Registration);