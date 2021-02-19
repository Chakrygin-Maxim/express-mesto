const validator = require("validator");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;
        return regex.test(link);
      },
      message: (props) => `${props.value} невалидная ссылка!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: (props) => `${props.value} невалидная электронная почта!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  //* попытаемся найти пользователя по почте
  return this.findOne({ email })
    .select("+password") //* this — это модель User
    .then((user) => {
      //* если не нашёлся — отклоняем промис создав ошибку
      if (!user) {
        return Promise.reject(new Error("Неправильная почта"));
      }

      //* если нашёлся — сравниваем хеши паролей
      return bcrypt.compare(password, user.password).then((matched) => {
        //* если хеши не совпали - отклоняем промис
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model("user", userSchema);
