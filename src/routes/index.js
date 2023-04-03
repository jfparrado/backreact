const { Router } = require("express");

const movieRoutes = require("./routes/movie.js");
const router = Router();

router.use("/", movieRoutes);

module.exports = router;
