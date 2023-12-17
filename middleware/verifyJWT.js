const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader) {
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  const token = authHeader?.split(" ")[1];

  jwt.verify(token, process.env.AUTH_ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.email = decoded.UserInfo.email;
    req.phoneNumber = decoded.UserInfo.phoneNumber;
    req.userId = decoded.UserInfo.userId;
    req.lat = decoded.UserInfo.lat;
    req.lng = decoded.UserInfo.lng;
    req.firstName = decoded.UserInfo.firstName;
    req.lastName = decoded.UserInfo.lastName;
    next();
  });
};

module.exports = verifyJWT;
