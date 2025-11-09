import { getTrendingMovie, updateSearchCount } from "./appwrite";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Pagination from "./components/Pagination";
import Spinner from "./components/Spinner";

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("a");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDbouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [pagination, setPagination] = useState(1);
  
  useDebounce(() => setDbouncedSearchTerm(searchTerm), 900, [searchTerm]);

  const fetchMovie = async (query = "") => {
    setIsLoading(true);
    setError("");

    try {
      const endPoint = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_URL}/discover/movie?page=${pagination}&sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      const { results } = await response.json();
      setMovieList(results);
      if (query && results.length > 0) {
        await updateSearchCount(query, results[0]);
      }
    } catch {
      setError("Error fetching movies! Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovie();
      setTrendingMovies(movies);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMovie(debouncedSearchTerm);
  }, [debouncedSearchTerm, pagination]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main className="pattern">
      <div className="wrapper">
        <header>
          <img src="hero.png" alt="Hero background" />
          <h1>
            Find <span className="text-gradient">Movie</span> You'll Enjoy
            Without the Hassle.
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Most Search</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className="mt-10">All movies</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
      <div className="flex justify-center">
        <Pagination pagination={pagination} setPagination={setPagination} />
      </div>
    </main>
  );
};

export default App;
