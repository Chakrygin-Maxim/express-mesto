const router = require("express").Router();
const auth = require("../middlewares/auth");

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

router.get("/users/me", auth, userInfo);

// поиск пользователя по id
router.get("/users/:id", auth, validateId, getUser);

// обновление профиля
router.patch("/users/me", auth, validateUserInfo, updateUserInfo);

// обновление аватара
router.patch("/users/me/avatar", auth, validateUserAvatar, updateUserAvatar);

module.exports = router;
