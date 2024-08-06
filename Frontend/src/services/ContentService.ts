import { Axios, AxiosResponse } from 'axios';
import { FilmsListResponse } from '../models/response/FilmsListResponse';
import $contentApi from '../http/content';
import FilmDescribtionResponse from '../models/response/FilmDescribtionResponse';

export default class ContentService {
   static async getFilmsList(category: string): Promise<AxiosResponse<FilmsListResponse[]>> {
      return $contentApi.post<FilmsListResponse[]>('/previews', {category});
   }

   static async getFilmDescribtion(category: string, id: string | undefined): Promise<AxiosResponse<FilmDescribtionResponse>> {
      return $contentApi.post<FilmDescribtionResponse>('/describtion', {category, id});
   }
}