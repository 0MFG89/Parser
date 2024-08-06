type IAuthErrors = {
   type: string,
   value: string,
   msg: string,
   path: string,
   location: string
}

export interface IAuthError {
   message: string;
   errors: IAuthErrors[];
}

export type {IAuthErrors};