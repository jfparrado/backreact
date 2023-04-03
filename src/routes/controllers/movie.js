const axios = require("axios");
const { Movie } = require("../../db");
const { API_KEY } = process.env;
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
function getTenDaysAgo() {
  const today = new Date();
  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  const year = tenDaysAgo.getFullYear();
  const month = String(tenDaysAgo.getMonth() + 1).padStart(2, "0");
  const day = String(tenDaysAgo.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getImportantInfo(data) {
  const importantInfo = data.map((movie) => {
    //aca transformamos el array con strings a un array con objetos dentro
    const {
      genre_ids,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      vote_average,
    } = movie;
    const newInfo = {
      genre_ids,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      vote_average,
    };
    return newInfo;
  });
  return importantInfo;
}
async function joinGendersNames(movies) {
  const genderList = await getMovieGenders();
  movies.forEach((movie) => {
    const genreNames = movie.genre_ids.map(
      (genreId) => genderList.find((genre) => genre.id === genreId).name
    );
    movie.genre_names = genreNames;
    delete movie.genre_ids;
  });
  return movies;
}

const getAllMovies = async () => {
  try {
    const infoApi = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
    );
    const data = infoApi.data.results;
    let moviesInfo = getImportantInfo(data);
    moviesInfo = await joinGendersNames(moviesInfo);
    return moviesInfo;
  } catch (error) {
    console.log("El error controller getAllMovies es:", error.message);
  }
};

const getTopRanked = async () => {
  try {
    const infoApi = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );
    const data = infoApi.data.results;
    let moviesInfo = getImportantInfo(data);
    moviesInfo = await joinGendersNames(moviesInfo);
    return moviesInfo;
  } catch (error) {
    console.log("El error controller getAllMovies es:", error.message);
  }
};

const getLatestMovies = async () => {
  try {
    const todaysDate = getTodayDate();
    const tenDaysAgo = getTenDaysAgo();
    const infoApi = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&primary_release_date.lte=${todaysDate}&primary_release_date.gte=${tenDaysAgo}`
    );
    const data = infoApi.data.results;
    let moviesInfo = getImportantInfo(data);
    moviesInfo = await joinGendersNames(moviesInfo);
    return moviesInfo;
  } catch (error) {
    console.log("El error controller getLatestMovies es:", error.message);
  }
};

const getMovieGenders = async () => {
  try {
    const infoApi = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = infoApi.data.genres;
    const genders = data;
    return genders;
  } catch (error) {
    console.log("El error controller getMovieGenders es:", error.message);
  }
};

module.exports = {
  getAllMovies,
  getTopRanked,
  getMovieGenders,
  getLatestMovies,
};
// como hago pa crear dietas autimaticamente? osea sin meterle yo manualmente el id
