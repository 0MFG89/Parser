import { FilmsItem } from "../../models/response/FilmsListResponse"

export interface IFilmCardProps {
   content: FilmsItem,
   refLast?: (node: HTMLDivElement) => void
}

