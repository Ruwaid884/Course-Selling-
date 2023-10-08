const jwt = require("jsonwebtoken");

const SECRETKEY = "h33loFromRu";
const UserSecretKey = "infinity";

const authenticateJwt = (req, res, next) => {
  const authhead = req.headers.authorization;
  if (authhead) {
    const token = authhead.split(" ")[1];
    jwt.verify(token, SECRETKEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const authenticateJwtUsers = (req, res, next) => {
  try {

    const authhead = req.headers.authorization;
    if (authhead) {
      const token = authhead.split(" ")[1];
      jwt.verify(token, UserSecretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error)
  }
};

module.exports = {
  authenticateJwt,
  authenticateJwtUsers,
  SECRETKEY,
  UserSecretKey,
};
