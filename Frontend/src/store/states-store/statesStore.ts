import { makeAutoObservable } from 'mobx';

export default class StatesStore {
   isModal = false;

   constructor() {
      makeAutoObservable(this);
   }

   setIsModal(bool: boolean) {
      this.isModal = bool;
   }
}