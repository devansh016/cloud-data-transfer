const User = require("../models/userModel");

const { v4: uuidv4 } = require("uuid");

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && user.verifyUserPassword(password)) {
    console.log("User Login", user);
    return {
      status: 200,
      response: {
        user: user.getUserData(),
        token: user.generateToken(),
        message: "User Login Successfully.",
      },
      token: user.generateToken(),
    };
  } else {
    console.log("User Login Failed");
    return {
      status: 403,
      response: {
        message: "Wrong email or password.",
      },
    };
  }
}

async function register({ name, email, password }) {
  if (await User.findOne({ email })) {
    console.log("User Signup Failed");
    return {
      status: 409,
      response: {
        message: "Email id " + email + " is already in use.",
      },
    };
  } else if (await User.findOne({ email })) {
    console.log("User Signup Failed");
    return {
      status: 409,
      response: {
        message: "Email " + email + " is already in use.",
      },
    };
  } else {
    const user = new User({
      name,
      email,
      password,
      userid: uuidv4(),
    });
    await user.save();
    console.log("User Signup", user);
    return {
      status: 200,
      response: {
        message: "User Registered Success. Login to Continue.",
      },
    };
  }
}

module.exports = {
  authenticate,
  register,
};
