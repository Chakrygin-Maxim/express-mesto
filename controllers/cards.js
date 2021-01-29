const Card = require("../models/card");

function getCards(req, res) {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
}

function createCard(req, res) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: err.message }));
}

function deleteCard(req, res) {
  const currentUserId = req.user._id;

  Card.findById(req.params.id)
    .then((card) => {
      if (card.owner.toString() !== currentUserId) {
        res
          .status(403)
          .send({ message: "Недостаточно прав на удаление карточки" });
        return;
      }
      Card.findByIdAndDelete(req.params.id)
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err.message }));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
}

function setLikeToCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
}

function setDislikeToCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err.message }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLikeToCard,
  setDislikeToCard,
};
