export interface IFilmCardProps {
   content: IFilmCard
}

export interface IFilmCard {
   id: number;
   img: string;
   filmName: string;
   genre: string;
   filmYear: string
}