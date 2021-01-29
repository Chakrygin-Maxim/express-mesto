const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require("../controllers/users");

// отправка полного списка пользователей
router.get("/users", getUsers);

// поиск пользователя по id
router.get("/users/:id", getUser);

// создание пользователя
router.post("/users", createUser);

// обновление профиля
router.patch("/users/me", updateUserInfo);

// обновление аватара
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
