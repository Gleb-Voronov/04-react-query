import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import styles from './App.module.css';
import { Movie, FetchMoviesResponse } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data,
    isPending,
    isError,
    isSuccess,
  } = useQuery<FetchMoviesResponse, Error, FetchMoviesResponse, [string, string, number]>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev, 
  });

  useEffect(() => {
    if (data && Array.isArray(data.results) && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery === query) return;
    setQuery(searchQuery);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const hasMovies = data?.results && data.results.length > 0;
  const hasPagination = data?.total_pages && data.total_pages > 1;

  return (
    <div className={styles.app}>
      <Toaster position="top-right" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {query && isPending && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && hasMovies && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}
      {isSuccess && hasPagination && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default App;
