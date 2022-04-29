const router = require("express").Router();
const commentRoutes = require("./comment-routes");
const pizzaRoutes = require("./pizza-routes");

router.use("/comments", commentRoutes);
router.use("/pizzas", pizzaRoutes);

module.exports = router;

// this file will import all of the API routes to prefix their endpoint names and package them up
