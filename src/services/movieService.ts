
import axios, { AxiosResponse } from 'axios';
import { FetchMoviesResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<FetchMoviesResponse> => {
  const response: AxiosResponse<FetchMoviesResponse> = await axiosInstance.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};
