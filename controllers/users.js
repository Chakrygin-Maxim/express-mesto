const User = require("../models/user");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
}

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
}

function createUser(req, res) {
  const { name, about } = req.body;

  User.create({ name, about })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
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
    .catch((err) => res.status(500).send({ message: err.message }));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
};
