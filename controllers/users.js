const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //* модуль для создания jwt-токенов
const User = require("../models/user");
const { JWT_SECRET, JWT_TTL } = require("../config");
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

function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    // eslint-disable-next-line no-shadow
    .then((password) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password,
      })
    )

    .then((data) => {
      res.send({
        _id: data._id,
        email: data.email,
      });
    })

    .catch((error) => {
      if (error.name === "MongoError" || error.code === 11000) {
        // пользователь с такой почтой уже существует
        throw new Error(error.message);
      }

      throw new Error(error.message);
    })
    .catch(next);
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
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: "Пользователь не найден!" });
        return;
      }
      res.send(user);
    })
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
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: "Пользователь не найден!" });
        return;
      }
      res.send(user);
    })
    .catch((err) => sendError(res, err));
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: JWT_TTL,
      });
      res.status(200).send({ token });
    })
    .catch((error) => {
      throw new Error(error.message);
    })

    .catch(next);
}

function userInfo(req, res) {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: "Пользователь не найден!" });
        return;
      }
      const { _id, name, about, avatar } = user;
      res.send({ _id, name, about, avatar });
    })
    .catch((err) => sendError(res, err));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  userInfo,
};
