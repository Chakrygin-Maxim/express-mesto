const Card = require("../models/card");
const { sendError } = require("../errors/error");

function getCards(req, res) {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch((err) => sendError(res, err));
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => sendError(res, err));
}

function deleteCard(req, res) {
  const currentUserId = req.user._id;

  Card.findById(req.params.id)
    .orFail(res.status(404).send({ message: "Карточка не найдена!" }))
    .then((card) => {
      if (card.owner.toString() !== currentUserId) {
        res
          .status(403)
          .send({ message: "Недостаточно прав на удаление карточки" });
        return;
      }
      Card.findByIdAndDelete(req.params.id)
        .then((data) => res.send(data))
        .catch((err) => sendError(res, err));
    })
    .catch((err) => sendError(res, err));
}

function setLikeToCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((data) => {
      if (data === null) {
        res.status(404).send({ message: "Карточка не найдена!" });
        return;
      }
      res.send(data);
    })
    .catch((err) => sendError(res, err));
}

function setDislikeToCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((data) => {
      if (data === null) {
        res.status(404).send({ message: "Карточка не найдена!" });
        return;
      }
      res.send(data);
    })
    .catch((err) => sendError(res, err));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLikeToCard,
  setDislikeToCard,
};
