import { IUser } from '../../models/IUser'
import { makeAutoObservable } from 'mobx';
import AuthService from '../../services/AuthService';
import axios from 'axios';
import { AuthResponse } from '../../models/response/AuthResponse';
import { API_URL } from '../../http/user/index';
import { IAuthError } from '../../models/IAuthError';

export default class UserStore {
   user = {} as IUser;
   isAuth = false;
   error = {} as IAuthError;

   constructor() {
      makeAutoObservable(this);
   }

   setAuth(bool: boolean) {
      this.isAuth = bool;
   }

   setUser(user: IUser) {
      this.user = user;
   }

   setError(error: IAuthError) {
      this.error = error;
   }

   async login(email: string, password: string) {
      try {
         const response = await AuthService.login(email, password);
         localStorage.setItem('token', response.data.accessToken);
         this.setAuth(true);
         this.setUser(response.data.userDto);

      } catch(e: any) {
         this.setError(e.response?.data);
         console.log(e.response?.data?.message);
      }
   }

   async registration(email: string, password: string, repeatPassword: string) {
      try {
         const response = await AuthService.registration(email, password, repeatPassword);
         localStorage.setItem('token', response.data.accessToken);
         return true;
      } catch(e: any) {
         this.setError(e.response?.data);
         console.log(e.response?.data?.message);
      }
   }

   async logout() {
      try {
         const response = await AuthService.logout();
         localStorage.removeItem('token');
         this.setAuth(false);
         this.setUser({} as IUser);
      } catch(e: any) {
         this.setError(e.response?.data);
         console.log(e.response?.data?.message);
      }
   }

   async checkAuth() {
      try {   
         const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
         localStorage.setItem('token', response.data.accessToken);
         this.setAuth(true);
         this.setUser(response.data.userDto);
      } catch (e: any) {
         console.log(e.response?.data?.message);
      }
   }
}