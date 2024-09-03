import { AxiosResponse } from 'axios';
import $contentApi from '../http/content';
import { FilmRating } from '../models/response/FilmsListResponse';


export default class ContentService {
   static async setRating(category: string, itemId: number, userId: number, rating: number): Promise<AxiosResponse<boolean>> {
      return $contentApi.post<boolean>('/set-rating', 
         {category, itemId, userId, rating}
      );
   }

   static async setLike(category: string, itemId: number, userId: number): Promise<AxiosResponse<boolean>> {
      return $contentApi.post<boolean>('/set-like', 
         {category, itemId, userId}
      );
   }

   static async setWillWatch(category: string, itemId: number, userId: number): Promise<AxiosResponse<boolean>> {
      return $contentApi.post<boolean>('/set-will-watch',
         {category, itemId, userId}
      );
   }

   static async getFilmRating(itemId: number): Promise<AxiosResponse<FilmRating>> {
      return $contentApi.post<FilmRating>('/get-rating', 
         { category: 'films', itemId }
      );
   }
}