const router = require("express").Router();
const { validateId, validateCard } = require("../middlewares/validation");
const {
  getCards,
  createCard,
  deleteCard,
  setLikeToCard,
  setDislikeToCard,
} = require("../controllers/cards");

// получение карточек
router.get("/cards", getCards);

// добавление карточки
router.post("/cards", validateCard, createCard);

// удаление карточки
router.delete("/cards/:id", validateId, deleteCard);

// поставить карточке лайк
router.put("/cards/:cardId/likes", setLikeToCard);

// убрать лайк у карточки
router.delete("/cards/:cardId/likes", setDislikeToCard);

module.exports = router;
