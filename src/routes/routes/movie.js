const { Router } = require("express");
const router = Router();
const {
  getAllMovies,
  getTopRanked,
  getMovieGenders,
  getLatestMovies,
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
    const latestMovies = await getLatestMovies();
    res.status(200).send(latestMovies);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
