const router = require("express").Router();
const fs = require("fs");

// чтение файла с пользователями
let users = [];
fs.readFile("./data/users.json", "utf8", (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

// отправка полного списка пользователей
router.get("/", (req, res) => {
  res.send(users);
});

// поиск пользователя по id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const result = users.find((user) => {
    return user._id === id;
  });

  if (!result) {
    res.status(404).send({ message: "Нет пользователя с таким id" });
    return;
  }

  res.send(result);
});

module.exports = router;
