const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Необходима авторизация");
  }

  req.user = payload; //* записали пейлоуд в объект запроса

  next(); //* пропустили запрос дальше
};
