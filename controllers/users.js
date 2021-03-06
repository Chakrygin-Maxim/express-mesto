const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //* модуль для создания jwt-токенов
const User = require("../models/user");
const { JWT_SECRET, JWT_TTL } = require("../config");
const AuthError = require("../errors/AuthError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

function getUser(req, res, next) {
  User.findById(req.params.id)

    .then((user) => {
      if (user === null) {
        throw new NotFoundError("Пользователь не найден!");
      }
      res.send(user);
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      throw new NotFoundError("Пользователь не найден!");
    })
    .catch(next);
}

function createUser(req, res, next) {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    // eslint-disable-next-line no-shadow
    .then(
      // eslint-disable-next-line no-shadow
      (password) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        User.create({
          name,
          about,
          avatar,
          email,
          password,
          // eslint-disable-next-line comma-dangle
        })
      // eslint-disable-next-line function-paren-newline
    )
    .then((data) => {
      // eslint-disable-next-line no-shadow
      const { _id, email } = data;
      res.send({ data: { _id, email } });
    })

    .catch((error) => {
      if (error.name === "MongoError" || error.code === 11000) {
        // пользователь с такой почтой уже существует
        throw new ConflictError(error.message);
      }

      throw new ConflictError(error.message);
    })
    .catch(next);
}

function updateUserInfo(req, res, next) {
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
        throw new NotFoundError("Пользователь не найден!");
      }
      res.send(user);
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })

    .catch(next);
}

function updateUserAvatar(req, res, next) {
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
        throw new NotFoundError("Пользователь не найден!");
      }
      res.send(user);
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })

    .catch(next);
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
    .catch((err) => {
      throw new AuthError(err.message);
    })

    .catch(next);
}

function userInfo(req, res, next) {
  User.findById(req.user._id)
    .then((data) => {
      if (data === null) {
        throw new NotFoundError("Пользователь не найден!");
      }
      res.send({ data });
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
}

module.exports = {
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  userInfo,
};
