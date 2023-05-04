const { Router } = require("express");
const router = Router();
const {
  verifyToken,
  getAllMovies,
  getTopRanked,
  getMovieGenders,
  getLatestMovies,
  getMovieById,
  getMoviesByGender,
  getMoviesByName,
} = require("../controllers/movie");

router.get("/", async (req, res) => {
  try {
    const allMovies = await getAllMovies();
    res.status(200).send(allMovies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/topranked", async (req, res) => {
  try {
    const allMovies = await getTopRanked();
    res.status(200).send(allMovies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/moviegenders", async (req, res) => {
  try {
    const allGenders = await getMovieGenders();
    res.status(200).send(allGenders);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/latestmovies", async (req, res) => {
  try {
    await verifyToken(req, res, getLatestMovies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/search/:movie_name", async (req, res) => {
  const { movie_name } = req.params;
  try {
    await verifyToken(req, res, getMoviesByName, movie_name);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/moviesbygender/:movie_gender", async (req, res) => {
  const { movie_gender } = req.params;
  try {
    await verifyToken(req, res, getMoviesByGender, movie_gender);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/detailmovie/:movie_id", async (req, res) => {
  const { movie_id } = req.params;
  try {
    await verifyToken(req, res, getMovieById, movie_id);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
