import { FC, useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback, useContext } from "react";
import SlideItem from './SlideItem';
import { Context } from '../../index';
import { observer } from "mobx-react-lite";

const Slider: FC = () => {
   const container = useRef<HTMLUListElement>(null);
   const interval = useRef<NodeJS.Timer | null>(null);
   const [curSlide, setCurSlide] = useState<number>(1);
   const [translateX, setTranslateX] = useState<number>(0);
   const { contentStore } = useContext(Context);
   const content = contentStore.sliderContent;
   const images = content.map(item => item.img);

   const prevSlide = useCallback(() => {
      container.current!.style.transitionDuration = "400ms";
      if (curSlide <= 1) {
         setTranslateX(0);
         setCurSlide(images.length);
      } else {
         setTranslateX(container.current!.clientWidth*(curSlide - 1));
         setCurSlide(prev => --prev);
      }
   }, [curSlide, images]);

   const nextSlide = useCallback(() => {
      container.current!.style.transitionDuration = "400ms";
      if (curSlide >= images.length) {
         setTranslateX(container.current!.clientWidth*(images.length+1));
         setCurSlide(1);
      } else {
         setTranslateX(container.current!.clientWidth*(curSlide+1));
         setCurSlide(prev => ++prev);
      }
   }, [curSlide, images]);

   useEffect(() => {
      const transitionEnd = () => {
         if (curSlide <= 1) {
            container.current!.style.transitionDuration = "0ms";
            setTranslateX(container.current!.clientWidth*curSlide);
         }

         if (curSlide >= images.length) {
            container.current!.style.transitionDuration = "0ms";
            setTranslateX(container.current!.clientWidth*images.length);
         }
      };

      document.addEventListener('transitionend', transitionEnd);

      return () => {
         document.removeEventListener('transitionend', transitionEnd); 
      }
   }, [curSlide, images]);

   useEffect(() => {
      if (interval.current) clearInterval(interval.current);
      interval.current = setInterval(() => {
         nextSlide();
      }, 4000);
      return  () => {
         if (interval.current) clearInterval(interval.current);
      }
   }, [prevSlide, nextSlide]);

   const slides = useMemo(() => {
      const items = content.map((item, index) => (
         <li key={index} className="slide">
            <SlideItem
               id={item.id}
            />
         </li>
      ));

      return [
         <li key={content.length + 1} className="slide">
            <SlideItem 
               id={content[content.length-1]?.id}
            />
         </li>,
         ...items,
         <li key={content.length + 2} className="slide">
            <SlideItem
               id={content[0]?.id}
            />
         </li>
      ]
   }, [content]);

   useLayoutEffect(() => {
      setTranslateX(container.current!.clientWidth*curSlide);
   }, [])

   return <div className="slider-wrapper">
      <ul
         ref={container}
         className="slider-container" 
         style={{transform: `translateX(${-translateX}px)`}}
      >
         {slides}
      </ul>
      <button
         onClick={prevSlide} 
         className="slider-controll-left"
      >
         {"<"}
      </button>
      <button
         onClick={nextSlide}
         className="slider-controll-right"
      >
         {">"}
      </button>
   </div>
}

export default observer(Slider);