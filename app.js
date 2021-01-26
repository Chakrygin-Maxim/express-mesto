const express = require("express");

const mongoose = require("mongoose");
const routes = require("./routes/index");

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mydb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on("open", () => {
  // eslint-disable-next-line no-console
  console.log("DB connected");
});

app.use(express.static(`${__dirname}/public`));
app.use(routes);

// заглушка других запросов на несуществующий адрес
app.get("/*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
