const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const ForbiddenError = require("../errors/ForbiddenError");

function getCards(req, res, next) {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      const { likes, link, name, owner, _id } = card;
      res.send({
        likes,
        link,
        name,
        _id,
        owner: {
          _id: owner,
        },
      });
    })
    .catch((err) => {
      throw new ValidationError(err.message);
    })
    .catch(next);
}

function deleteCard(req, res, next) {
  const currentUserId = req.user._id;

  Card.findById(req.params.id)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError({ message: "Карточка не найдена" });
      }
      if (card.owner.toString() !== currentUserId) {
        throw new ForbiddenError({
          message: "Недостаточно прав на удаление карточки",
        });
      }
      Card.findByIdAndDelete(req.params.id)
        .then((data) => res.send(data))
        .catch(next);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
}

function setLikeToCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .populate("owner")
    .then((data) => {
      if (data === null) {
        throw new NotFoundError({ message: "Карточка не найдена" });
      }
      res.send(data);
    })
    .catch(next);
}

function setDislikeToCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .populate("owner")
    .then((data) => {
      if (data === null) {
        throw new NotFoundError({ message: "Карточка не найдена" });
      }
      res.send(data);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLikeToCard,
  setDislikeToCard,
};
