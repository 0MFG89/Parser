import { observer } from "mobx-react-lite"
import { FC, useContext, useEffect, useState } from "react";
import logo from '../../assets/images/logo.png';
import { Context } from '../../index';
import { AiOutlineLogout,  AiOutlineLogin } from "react-icons/ai";
import Modal from '../Modal/Modal';
import { IAuthError } from "../../models/IAuthError";
import { Link } from "react-router-dom";
import { GiHamburgerMenu, GiFilmStrip, GiFilmSpool } from "react-icons/gi";
import { BsMusicPlayer } from "react-icons/bs";

const Header: FC = () => {
   const { userStore, statesStore } = useContext(Context);
   const [burgerIsOpen, setBurgerIsOpen] = useState(false);

   const burgerHandler = () => {
      setBurgerIsOpen((prev) => !prev);
   }

   useEffect(() => {
      userStore.setError({} as IAuthError);
   }, [statesStore.isModal]);

   console.log('Header render');

   return <header>
      <div className="header-container">
         <div className="logo-container">
            <div className="product-logo">
               <Link to='/'>
                  <img src={logo} alt="" className="logo" />
               </Link>
            </div>
            <div className="product-name-container">
               <Link to='/' className="product-name">               
                  <span>Skibidi</span>
                  <span>Films</span>
               </Link>

            </div>
         </div>
         <nav className="nav-menu">
            <div className="burger" onClick={burgerHandler}>
               <GiHamburgerMenu />
            </div>
            <ul className={"nav-list" + (burgerIsOpen ? " burger-open" : "")}>
               <li className="nav-element">
                  {burgerIsOpen && <Link to='/anime-serials'><GiFilmStrip /></Link>}
                  <Link to="/films" className="nav-link">
                     Фильмы
                  </Link>
               </li>
               <li className="nav-element">
                  {burgerIsOpen && <Link to='/anime-serials'><GiFilmSpool /></Link>}
                  <Link to="/serials" className="nav-link">
                     Сериалы
                  </Link>
               </li>
               <li className="nav-element">
                  {burgerIsOpen && <Link to='/anime-serials'><BsMusicPlayer /></Link>}
                  <Link to="/anime-serials" className="nav-link">
                     Музыка
                  </Link>
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
                          <span>Выйти</span>&nbsp;<AiOutlineLogout />
                        </div>
                     </div>
                     : <div className="user">
                        <div className="login" onClick={() => statesStore.setIsModal(true)}>
                           <span>Войти</span>&nbsp;<AiOutlineLogin />
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