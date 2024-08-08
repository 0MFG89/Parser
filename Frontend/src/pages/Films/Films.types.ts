import { LegacyRef } from "react";

export interface IFilmCardProps {
   content: IFilmCard,
   refLast?: (node: HTMLDivElement) => void
}

export interface IFilmCard {
   id: number;
   img: string;
   filmName: string;
   genre: string;
   filmYear: string
}

