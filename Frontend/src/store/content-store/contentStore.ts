import { makeAutoObservable } from 'mobx';
import { FilmsDetails, FilmsItem } from '../../models/response/FilmsListResponse';
import ContentService from '../../services/ContentService';
import FilmDescribtionResponse from '../../models/response/FilmDescribtionResponse';
import axios from 'axios';


export default class ContentStore {
   filmsList = [] as FilmsItem[];
   filmDescribtion = {} as FilmDescribtionResponse;
   sliderContent = [] as FilmsItem[];
   filmsPage = 0;
   pageSize = 30;
   filmsListHasMore = false;

   constructor() {
      makeAutoObservable(this);
   }

   setFilmsList(films: FilmsItem[]) {
      this.filmsList = films;
   }

   setFilmDescribtion(filmDescribtion: FilmDescribtionResponse) {
      this.filmDescribtion = filmDescribtion;
   }

   setSliderContent(films: FilmsItem[]) {
      this.sliderContent = films;
   }

   setItemIsLiked(id: number, item: FilmsItem) {
      if (item.id === id && item.details) {
         item.details.isLiked = !item.details.isLiked;
         return;
      }
      if (item.id === id) {
         item.details = {} as FilmsDetails;
         item.details.isLiked = true;
      }
   }

   setItemWillWatch(id: number, item: FilmsItem) {
      if (item.id === id && item.details) {
         item.details.willWatch = !item.details.willWatch;
         return;
      }
      if (item.id === id) {
         item.details = {} as FilmsDetails;
         item.details.willWatch = true;
      }
   }
   
   setRating(id: number, newRating: number) {
      for (let slide of this.sliderContent) {
         if (slide.id !== id) continue;
         if (slide.rating.prevUserRating !== -1) {
            slide.rating.value = 
               (slide.rating.value * slide.rating.voices - slide.rating.prevUserRating + newRating) / slide.rating.voices;
            slide.rating.prevUserRating = newRating;
            return;
         }
         slide.rating.voices++;
         slide.rating.value =  
            (slide.rating.value * slide.rating.voices + newRating) / slide.rating.voices;
      }
      for (let film of this.filmsList) {
         if (film.id !== id) continue;
         if (film.rating.prevUserRating !== -1) {
            film.rating.value = 
               (film.rating.value * film.rating.voices - film.rating.prevUserRating + newRating) / film.rating.voices;
            film.rating.prevUserRating = newRating;
            return;
         }
         film.rating.voices++;
         film.rating.value =  
            (film.rating.value * film.rating.voices + newRating) / film.rating.voices;
         film.rating.prevUserRating = newRating;
      }   
   }

   setIsLiked(id: number) {
      for (let slide of this.sliderContent) {
         this.setItemIsLiked(id, slide);
      }
      for (let film of this.filmsList) {
         this.setItemIsLiked(id, film);
      }
   }

   setWillWatch(id: number) {
      for (let slide of this.sliderContent) {
         this.setItemWillWatch(id, slide);
      }
      for (let film of this.filmsList) {
         this.setItemWillWatch(id, film);
      }
   }

   setPageSize(num: number) {
      this.pageSize = num;
   }

   setFilmsListHasMore(bool: boolean) {
      this.filmsListHasMore = bool;
   }

   setFilmsPage(num: number) {
      this.filmsPage = num;
   }

   async getFilmsPreviews(category: string, userId: number) {
      try {
         const page = this.filmsPage;
         const pageSize = this.pageSize;
         let response = [] as FilmsItem[];
         await ContentService.getFilmsList(category, page, pageSize, userId)
                           .then(res => {
                           response = res.data.data;
                           this.setFilmsListHasMore(res.data.hasMore);
                        }).catch(e => {
                           if (axios.isCancel(e)) return;
                        });
         this.setFilmsList([...this.filmsList, ...response]);
         if (!this.sliderContent.length) this.setSliderContent(response.slice(0, 5));
      } catch(e: any) {
         console.log(e);
      }
   }

   async getFilmDescribtion(category: string, id: string | undefined) {
      try {
         const response = await ContentService.getFilmDescribtion(category, id);
         this.setFilmDescribtion(response.data);
      } catch(e: any) {
         console.log(e);
      }
   }
}