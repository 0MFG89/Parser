import { FC } from 'react';
import './Footer.scss';
import { observer } from 'mobx-react-lite';
import { FaTelegram, FaVk, FaInstagram } from "react-icons/fa";

const Footer: FC = () => {
   return <footer>
      <div className="footer-container">
         <div className="socials">
                  <FaVk />
                  <FaTelegram />
                  <FaInstagram />
         </div>
      </div>
   </footer>
}

export default observer(Footer);