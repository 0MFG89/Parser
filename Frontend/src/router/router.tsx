import { createBrowserRouter } from "react-router-dom";
import Films from "../pages/Films/Films";
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import FilmDescribtion from "../pages/FilmDescrintion/FilmDescribtion";
import MainLayout from "../layouts/MainLayout/MainLayout";

const index = {
   path: '/',
   element: <Films />
};

const films = {
   path: '/films',
   element: <Films />,
};

const filmDescribtion = {
   path: '/films/:filmId',
   element: <FilmDescribtion />
};

const serials = {
   path: '/serials',
   element: <></>
};

const animeSerials = {
   path: '/anime-serials',
   element: <></>
};

const home = {
   path: '/',
   element: <MainLayout />,
   children: [index, films, filmDescribtion, serials, animeSerials],
   errorElement: <NotFoundPage />
};

const router = createBrowserRouter([
   home
]);

export default router;