import db from "../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = (req, res) => {
  db.then(async (d) => {
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
  });
};

export const login = async (req, res) => {
  const d = await db;

  const re = await d.get(
    `SELECT password from users where email='${req.body.email}' limit 1`,
  );

  if (!re) {
    res.status(400).send("user no exist");
    return;
  }

  bcrypt.compare(req.body.password, re.password, function (err, result) {
    if (result) {
      var token = jwt.sign({ email: req.body.email }, process.env.SECRET_TOKEN);
      res.cookie("auth", token).set("hx-location", "/").send("success");
    } else {
      res.status(400).send("INvalid password");
    }
  });
};
