import axios, { AxiosResponse } from 'axios';
import { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

interface FetchMoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response: AxiosResponse<FetchMoviesResponse> = await axiosInstance.get('/search/movie', {
    params: {
      query,
    },
  });
  return response.data.results;
};
