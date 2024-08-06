import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react";
import logo from '../../assets/images/logo.png';
import  './Header.scss';
import { Context } from '../../index';
import { AiOutlineLogout,  AiOutlineLogin } from "react-icons/ai";
import Modal from '../Modal/Modal';
import { IAuthError } from "../../models/IAuthError";
import { Link } from "react-router-dom";

const Header: FC = () => {
   const { userStore, statesStore } = useContext(Context);

   useEffect(() => {
      userStore.setError({} as IAuthError);
   }, [statesStore.isModal])

   return <header>
      <div className="header-container">
         <div className="logo-container">
            <Link to='/'>
               <img src={logo} alt="" className="logo" />
            </Link>
         </div>
         <nav className="nav-menu">
            <ul className="nav-list">
               <li className="nav-element">
                  <Link to="/films">Фильмы</Link>
               </li>
               <li className="nav-element">
                  <Link to="/serials">Сериалы</Link>
               </li>
               <li className="nav-element">
                  <Link to="/anime-serials">Аниме</Link>
               </li>
            </ul>
         </nav>
         <div className="header-rightside">
            <div className="user-menu">
               {
                  userStore.isAuth 
                     ? <div className="user">
                        <div className="user-icon"></div>
                        <div className="logout" onClick={() => userStore.logout()}>
                          Выйти&nbsp;<AiOutlineLogout />
                        </div>
                     </div>
                     : <div className="user">
                        <div className="login" onClick={() => statesStore.setIsModal(true)}>
                           Войти&nbsp;<AiOutlineLogin />
                        </div>
                     </div>
               }
            </div>
         </div>
         {statesStore.isModal && <Modal />}
      </div>
   </header>
}

export default observer(Header);