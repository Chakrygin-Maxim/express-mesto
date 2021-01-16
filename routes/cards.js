const router = require("express").Router();
const fs = require("fs");

// чтение файла с карточками
let cards = [];
fs.readFile("./data/cards.json", "utf8", (err, data) => {
  if (err) throw err;
  cards = JSON.parse(data);
});

// отправка полного списка карточек
router.get("/", (req, res) => {
  res.send(cards);
});

module.exports = router;
