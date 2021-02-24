const router = require("express").Router();
const { validateId, validateCard } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

const {
  getCards,
  createCard,
  deleteCard,
  setLikeToCard,
  setDislikeToCard,
} = require("../controllers/cards");

// получение карточек
router.get("/cards", auth, getCards);

// добавление карточки
router.post("/cards", auth, validateCard, createCard);

// удаление карточки
router.delete("/cards/:id", auth, validateId, deleteCard);

// поставить карточке лайк
router.put("/cards/:id/likes", auth, validateId, setLikeToCard);

// убрать лайк у карточки
router.delete("/cards/:id/likes", auth, validateId, setDislikeToCard);

module.exports = router;
