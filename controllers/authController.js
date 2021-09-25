const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  try {
    const newUser = await User.create({ username, password: hashPassword });
    req.session.user = newUser;

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      console.log("user hereeee", user);

      req.session.user = user;

      res.status(201).json({
        status: "success",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Incorrect username or password",
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(400).json({
      status: "fail",
    });
  }
};
