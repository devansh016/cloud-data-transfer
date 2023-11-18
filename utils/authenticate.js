const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

async function authenticateUser(req, res, next) {
  try {
    const client_jwt_token = req.cookies.token;
    if (!client_jwt_token) {
      res.status(401).send({ success: false, message: "JWT token not found." });
      return;
    }
    var decoded = jwt.verify(client_jwt_token, process.env.JWT_SECRET);
    req.body.userid = decoded.userid;
    const user = await User.findOne({ userid: decoded.userid });
    if (user) {
      req.body.name = user.name;
      next();
    } else {
      res.status(401).send({ success: false, message: "User not found." });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
}

module.exports = authenticateUser;
