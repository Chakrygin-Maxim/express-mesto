const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");

const filepath = path.join("data", "users.json");
let users = [];

const fileData = () => fsPromises.readFile(filepath, { encoding: "utf8" });

const response = (res, status, data) => {
  res.status(status).send(data);
};

// отправка полного списка пользователей
router.get("/users", (req, res) => {
  fileData()
    .then((data) => {
      users = JSON.parse(data);
      response(res, 200, users);
    })
    .catch((err) => {
      response(res, 500, { message: err.message });
    });
});

// поиск пользователя по id
router.get("/users/:id", (req, res) => {
  const { id } = req.params;

  fileData()
    .then((data) => {
      users = JSON.parse(data);

      const result = users.find((user) => user._id === id);

      if (!result) {
        response(res, 404, { message: "Нет пользователя с таким id" });
        return;
      }
      response(res, 200, result);
    })
    .catch((err) => {
      response(res, 500, { message: err.message });
    });
});

module.exports = router;
