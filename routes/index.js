const router = require("express").Router();
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

router.use(usersRouter, cardsRouter);

module.exports = router;
