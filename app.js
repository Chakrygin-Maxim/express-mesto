const express = require("express");
const routes = require("./routes/index");

const app = express();
const { PORT = 3000 } = process.env;

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
