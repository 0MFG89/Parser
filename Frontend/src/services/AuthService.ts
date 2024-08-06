import $api from '../http/user/index';
import { Axios, AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
   static async login (email:string, password:string) : Promise<AxiosResponse<AuthResponse>> {
      return $api.post<AuthResponse>('/login', {email, password});
   }

   static async registration (email:string, password:string, repeatPassword:string) : Promise<AxiosResponse<AuthResponse>> {
      return $api.post<AuthResponse>('/registration', {email, password, repeatPassword});
   }

   static async logout () : Promise<void> {
      return $api.post('/logout');
   }
}