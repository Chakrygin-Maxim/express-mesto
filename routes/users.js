const router = require("express").Router();

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  userInfo,
} = require("../controllers/users");

router.get("/users/me", userInfo);

// отправка полного списка пользователей
router.get("/users", getUsers);

// поиск пользователя по id
router.get("/users/:id", getUser);

// обновление профиля
router.patch("/users/me", updateUserInfo);

// обновление аватара
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
