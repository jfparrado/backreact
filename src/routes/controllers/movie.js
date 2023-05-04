const axios = require("axios");
const admin = require("firebase-admin");
const serviceAccount = require("../../movies.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const basicUrl = "https://api.themoviedb.org/3/discover/movie?api_key=";
// const API_KEY = process.env.API_KEY;
const API_KEY = "62abf72420cd2bc60ec7409096a6ef2a";

async function verifyToken(req, res, funcion, ...args) {
  let result = "";
  const token = req.headers.authorization;
  await admin
    .auth()
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      const moviesResult = await funcion(...args);
      res.status(200).send(moviesResult);
    })
    .catch((error) => {
      res.status(401).send("user invalid");
    });
}

function getFormattedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
function getTodayDate() {
  const today = new Date();
  const formattedDate = getFormattedDate(today);
  return formattedDate;
}
function getTenDaysAgo() {
  const today = new Date();
  const tenDaysAgo = new Date(today);
  const formattedDate = getFormattedDate(tenDaysAgo);
  return formattedDate;
}
function getImportantInfoArray(data) {
  const importantInfo = data.map((movie) => {
    //aca transformamos el array con strings a un array con objetos dentro
    const {
      id,
      genre_ids,
      original_language,
      original_title,
      overview,
      poster_path,
      release_date,
      vote_average,
    } = movie;
    const newInfo = {
      id,
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
function getImportantInfoObject(data) {
  const {
    budget,
    genres,
    homepage,
    id,
    original_language,
    original_title,
    overview,
    popularity,
    poster_path,
    release_date,
    revenue,
    runtime,
    spoken_languages,
    status,
    vote_average,
  } = data;
  const newInfo = {
    budget,
    genres,
    homepage,
    id,
    original_language,
    original_title,
    overview,
    popularity,
    poster_path,
    release_date,
    revenue,
    runtime,
    spoken_languages,
    status,
    vote_average,
  };
  return newInfo;
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
async function getGenreCodeByName(genreName) {
  const genreList = await getMovieGenders();
  const genre = genreList.find(
    (genre) => genre.name.toLowerCase() === genreName.toLowerCase()
  );
  return genre ? genre.id : null;
}

function getNamesFromObjectsArray(objectsArray) {
  return objectsArray.map((object) => object.name);
}
function getEnglishNames(languages) {
  return languages.map((lang) => lang.english_name);
}
const getAllMovies = async () => {
  try {
    const infoApi = await axios.get(
      `${basicUrl}${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
    );
    const data = infoApi.data.results;
    let moviesInfo = getImportantInfoArray(data);
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
    let moviesInfo = getImportantInfoArray(data);
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
      `${basicUrl}${API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=1&primary_release_date.lte=${todaysDate}&primary_release_date.gte=${tenDaysAgo}`
    );
    const infoApi2 = await axios.get(
      `${basicUrl}${API_KEY}&language=en-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=2&primary_release_date.lte=${todaysDate}&primary_release_date.gte=${tenDaysAgo}`
    );
    const data = [...infoApi.data.results, ...infoApi2.data.results];
    const filteredData = data.filter((movie) => movie.poster_path !== null);
    let moviesInfo = getImportantInfoArray(filteredData);
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

const getMoviesByGender = async (movie_gender) => {
  try {
    const genreCode = await getGenreCodeByName(movie_gender);
    const infoApi = await axios.get(
      `${basicUrl}${API_KEY}&with_genres=${genreCode}`
    );
    const data = infoApi.data.results;
    let moviesInfo = getImportantInfoArray(data);
    return moviesInfo;
  } catch (error) {
    console.log("El error controller getMovieGenders es:", error.message);
  }
};

const getMoviesByName = async (movie_name) => {
  try {
    const infoApi = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie_name}`
    );
    const data = infoApi.data.results;
    let moviesInfo = getImportantInfoArray(data);
    moviesInfo = await joinGendersNames(moviesInfo);
    return moviesInfo;
  } catch (error) {
    console.log("El error controller getMovieGenders es:", error.message);
  }
};

const getMovieById = async (movie_id) => {
  try {
    const infoApi = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}&language=en-US`
    );
    const data = infoApi.data;
    let movieInfo = getImportantInfoObject(data);
    movieInfo.genres = await getNamesFromObjectsArray(movieInfo.genres);
    movieInfo.spoken_languages = await getEnglishNames(
      movieInfo.spoken_languages
    );
    console.log("movieInfo:", movieInfo);
    return movieInfo;
  } catch (error) {
    console.log("El error controller getMovieById es:", error.message);
  }
};

module.exports = {
  verifyToken,
  getAllMovies,
  getTopRanked,
  getMovieGenders,
  getLatestMovies,
  getMovieById,
  getMoviesByGender,
  getMoviesByName,
};
