const User = require("../models/user");
const { sendError } = require("../errors/error");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => sendError(res, err));
}

function getUser(req, res) {
  User.findById(req.params.id)

    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: "Пользователь не найден!" });
        return;
      }
      res.send(user);
    })
    .catch((err) => sendError(res, err));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => sendError(res, err));
}

function updateUserInfo(req, res) {
  const currentUserId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    currentUserId,
    { name, about },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((data) => res.send(data))
    .catch((err) => sendError(res, err));
}

function updateUserAvatar(req, res) {
  const currentUserId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    currentUserId,
    { avatar },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((data) => res.send(data))
    .catch((err) => sendError(res, err));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
