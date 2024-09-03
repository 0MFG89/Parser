import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FaTelegram, FaVk, FaInstagram } from "react-icons/fa";

const Footer: FC = () => {
   console.log('Footer render');

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

export default Footer;