import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

import styles from './App.module.css';
import { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsLoading(true);
    setIsError(false);

    try {
      const fetchedMovies = await fetchMovies(query);

      if (fetchedMovies.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(fetchedMovies);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
