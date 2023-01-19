import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const isAuth = req.headers.token;
    if (isAuth) {
      jwt.verify(isAuth, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          res.status(400).send({ message: "invalid token!" });
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.send({ message: "please provide token!" });
    }
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
};

export default verifyToken;
