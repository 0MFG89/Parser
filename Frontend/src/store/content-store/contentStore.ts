import { makeAutoObservable } from 'mobx';
import { FilmsListResponse } from '../../models/response/FilmsListResponse';
import ContentService from '../../services/ContentService';
import FilmDescribtionResponse from '../../models/response/FilmDescribtionResponse';

export default class ContentStore {
   filmsList = [] as FilmsListResponse[];
   filmDescribtion = {} as FilmDescribtionResponse;

   constructor() {
      makeAutoObservable(this);
   }

   setFilmsList(films: FilmsListResponse[]) {
      this.filmsList = films;
   }

   setFilmDescribtion(filmDescribtion: FilmDescribtionResponse) {
      this.filmDescribtion = filmDescribtion;
   }

   async getFilmsPreviews(category: string) {
      try {
         const response = await ContentService.getFilmsList(category);
         this.setFilmsList(response.data);
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