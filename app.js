const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on("open", () => {
  // eslint-disable-next-line no-console
  console.log("DB connected");
});

app.use((req, res, next) => {
  req.user = {
    _id: "601034e37b909d2e0474f946", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(routes);

// заглушка других запросов на несуществующий адрес
app.use("/*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
