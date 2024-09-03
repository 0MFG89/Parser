export interface FilmsDetails {
   id: number,
   filmId: number,
   userId: number,
   isLiked: boolean,
   willWatch: boolean,
   rating: number
}

export interface FilmRating {
   value: number,
   voices: number,
   prevUserRating: number
}

export interface FilmsItem {
   id: number;
   img: string;
   name: string;
   genre: string;
   year: string;
   rating: FilmRating;
   details: FilmsDetails;
}

export interface FilmsListResponse {
   data: FilmsItem[],
   hasMore: boolean
}