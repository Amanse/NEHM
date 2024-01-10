import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserSession from "../models/user_session.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Enter email/password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // res.status(400).render("register", { error: "Username already exists" });
      res.status(400).send("user exists");
      return;
    }

    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      // Store hash in your password DB.
      try {
        if (err) throw err;
        const newUser = User({
          email,
          password: hash,
        });

        await newUser.save();

        res.set("hx-location", "/").send("succky");
      } catch (e) {
        res.status(500).send("Couldn't create user");
      }
    });
  } catch (e) {
    res.status(500).send("Couldn't create user");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).send("user no exist");
      return;
    }

    bcrypt.compare(password, user.password, function (err, result) {
      console.log(user.password);
      try {
        if (err) throw err;
        if (result) {
          var token = jwt.sign(
            { email, id: user.id },
            process.env.SECRET_TOKEN,
          );
          const newSession = UserSession({
            token,
          });
          newSession.save();

          res.cookie("auth", token).set("hx-location", "/").send("success");
        } else {
          res.status(400).send("INvalid password");
        }
      } catch (e) {
        res
          .status(500)
          .send("Couldn't login right now, please try again later");
      }
    });
  } catch (e) {
    res.status(500).send("Couldn't login right now, please try again later");
  }
};

export const logout = async (req, res) => {
  await removeSession(req.cookies.auth);

  res.clearCookie("auth");
  res.redirect("/login");
};

export const removeSession = async (token) => {
  await UserSession.deleteOne({ token });
};

export const validateUser = async (token) => {
  const res = UserSession.find({ token });

  if (res === undefined) {
    return false;
  } else {
    return true;
  }
};

export const getUserInfoFromToken = (token) => {
  var dc = jwt.verify(token, process.env.SECRET_TOKEN);
  return dc;
};
