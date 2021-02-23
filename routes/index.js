const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { validateNewUser, validateLogin } = require("../middlewares/validation");

const usersRouter = require("./users");
const cardsRouter = require("./cards");

router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

router.post("/signin", validateLogin, login);
router.post("/signup", validateNewUser, createUser);

router.use(auth);
router.use(usersRouter, cardsRouter);

// заглушка других запросов на несуществующий адрес
router.use("/*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

module.exports = router;
