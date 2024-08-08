export interface FilmsList {
   id: number;
   img: string;
   filmName: string;
   genre: string;
   filmYear: string;
}

export interface FilmsListResponse {
   data: FilmsList[],
   hasMore: boolean
}