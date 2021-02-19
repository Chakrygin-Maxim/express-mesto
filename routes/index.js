const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

const usersRouter = require("./users");
const cardsRouter = require("./cards");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);
router.use(usersRouter, cardsRouter);

// заглушка других запросов на несуществующий адрес
router.use("/*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

module.exports = router;
