import db from "../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const d = await db;

  const result = await d.get(
    "SELECT email FROM users WHERE email = ?",
    req.body.email,
  );

  if (result) {
    res.status(400).send("useer exists");

    return;
  }

  bcrypt.hash(req.body.password, 10, function (err, hash) {
    // Store hash in your password DB.
    d.run(
      `INSERT INTO users (email, password) VALUES (?, ?);`,
      req.body.email,
      hash,
    );

    res.set("hx-location", "/").send("succky");
  });
};

export const login = async (req, res) => {
  const d = await db;

  const re = await d.get(
    `SELECT id,password from users where email='${req.body.email}' limit 1`,
  );

  if (!re) {
    res.status(400).send("user no exist");
    return;
  }

  try {
    bcrypt.compare(req.body.password, re.password, function (err, result) {
      if (result) {
        var token = jwt.sign(
          { email: req.body.email, id: re.id },
          process.env.SECRET_TOKEN,
        );
        d.run(`INSERT INTO user_session (token) VALUES (?)`, token);

        res.cookie("auth", token).set("hx-location", "/").send("success");
      } else {
        res.status(400).send("INvalid password");
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (req, res) => {
  await removeSession(req.cookies.auth);

  res.clearCookie("auth");
  res.redirect("/login");
};

export const removeSession = async (token) => {
  const d = await db;

  d.run("delete from user_session where token=?", token);
};

export const validateUser = async (token) => {
  const d = await db;

  const res = await d.get(
    "select token from user_session where token=?",
    token,
  );

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
