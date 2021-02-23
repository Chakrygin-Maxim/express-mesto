const router = require("express").Router();
const {
  validateId,
  validateUserInfo,
  validateUserAvatar,
} = require("../middlewares/validation");
const {
  getUser,
  updateUserInfo,
  updateUserAvatar,
  userInfo,
} = require("../controllers/users");

router.get("/users/me", userInfo);

// поиск пользователя по id
router.get("/users/:id", validateId, getUser);

// обновление профиля
router.patch("/users/me", validateUserInfo, updateUserInfo);

// обновление аватара
router.patch("/users/me/avatar", validateUserAvatar, updateUserAvatar);

module.exports = router;
