import axios, { AxiosResponse, Canceler } from 'axios';
import { FilmsListResponse } from '../models/response/FilmsListResponse';
import $contentApi from '../http/content';
import FilmDescribtionResponse from '../models/response/FilmDescribtionResponse';

export default class ContentService {
   static filmsListCancelToken = {} as Canceler;

   static async getFilmsList(category: string, page: number, pageSize: number, userId: number): Promise<AxiosResponse<FilmsListResponse>> {
      return $contentApi.post<FilmsListResponse>('/previews', 
         {category, page, pageSize, userId}, 
         {cancelToken: new axios.CancelToken((c) => this.filmsListCancelToken = c)}
      );
   }

   static async getFilmDescribtion(category: string, id: string | undefined): Promise<AxiosResponse<FilmDescribtionResponse>> {
      return $contentApi.post<FilmDescribtionResponse>('/describtion', {category, id});
   }
}