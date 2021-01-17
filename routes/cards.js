const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");

const filepath = path.join("data", "cards.json");
const fileData = () => fsPromises.readFile(filepath, { encoding: "utf8" });
const response = (res, status, data) => {
  res.status(status).send(data);
};

// чтение файла с карточками
let cards = [];

// отправка полного списка карточек
router.get("/cards", (req, res) => {
  fileData()
    .then((data) => {
      cards = JSON.parse(data);
      response(res, 200, cards);
    })
    .catch((err) => {
      response(res, 500, { message: err.message });
    });
});

module.exports = router;
