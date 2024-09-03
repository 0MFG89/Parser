import { makeAutoObservable } from 'mobx';
import DetailService from '../../services/DetailsService';
import { FilmsDetails, FilmsItem } from '../../models/response/FilmsListResponse';

export default class DetailsStore {
   unauthorizedErrorRating = false;
   unauthorizedErrorLike = false;
   unauthorizedErrorWillWatch = false;

   constructor() {
      makeAutoObservable(this);
   }

   setUnauthorizedErrorRating() {
      this.unauthorizedErrorRating = !this.unauthorizedErrorRating;
   }

   setUnauthorizedErrorLike() {
      this.unauthorizedErrorLike = !this.unauthorizedErrorLike;
   }

   setUnauthorizedErrorWillWatch() {
      this.unauthorizedErrorWillWatch = !this.unauthorizedErrorWillWatch;
   }

   async setRating(category: string, itemId: number, userId: number, rating: number) {
      try {
         await DetailService.setRating(category, itemId, userId, rating);
      } catch(e: any) {
         if (e.response?.status == 401) this.setUnauthorizedErrorRating();
         throw e;
      }
   }

   async setLike(category: string, itemId: number, userId: number) {
      try {
         await DetailService.setLike(category, itemId, userId);
      } catch(e: any) {
         if (e.response?.status == 401) this.setUnauthorizedErrorLike();
         throw e;
      }
   }

   async setWillWatch(category: string, itemId: number, userId: number) {
      try {
         await DetailService.setWillWatch(category, itemId, userId);
      } catch(e: any) {
         if (e.response?.status == 401) this.setUnauthorizedErrorWillWatch();
         throw e;
      }
   }
}