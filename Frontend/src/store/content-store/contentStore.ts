import { makeAutoObservable } from 'mobx';
import { FilmsList } from '../../models/response/FilmsListResponse';
import ContentService from '../../services/ContentService';
import FilmDescribtionResponse from '../../models/response/FilmDescribtionResponse';
import axios from 'axios';

export default class ContentStore {
   filmsList = [] as FilmsList[];
   filmDescribtion = {} as FilmDescribtionResponse;
   filmsPage = 0;
   pageSize = 20;
   filmsListHasMore = false;

   constructor() {
      makeAutoObservable(this);
   }

   setFilmsList(films: FilmsList[]) {
      this.filmsList = films;
   }

   setFilmDescribtion(filmDescribtion: FilmDescribtionResponse) {
      this.filmDescribtion = filmDescribtion;
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

   async getFilmsPreviews(category: string) {
      try {
         const page = this.filmsPage;
         const pageSize = this.pageSize;
         let response = [] as FilmsList[];
         await ContentService.getFilmsList(category, page, pageSize
                         ).then(res => {
                           response = res.data.data;
                           this.setFilmsListHasMore(res.data.hasMore);
                        }).catch(e => {
                           if (axios.isCancel(e)) return;
                        });
         this.setFilmsList([...this.filmsList, ...response]);
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