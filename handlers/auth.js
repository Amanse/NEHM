import db from "../lib/db.js";

export const signup = (req, res) => {
  db.then(async (d) => {
    console.log(req.body);
    const result = await d.get(
      "SELECT email FROM users WHERE email = ?",
      req.body.email,
    );

    if (result) {
      res.status(400).send("useer exists");
      return;
    }

    d.run(
      `INSERT INTO users (email, password) VALUES (?, ?);`,
      req.body.email,
      req.body.password,
    );

    res.set("hx-location", "/").send("succky");
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

  if (req.body.password === re.password) {
    res.cookie("auth", true).set("hx-location", "/").send("success");
  } else {
    res.status(400).send("INvalid password");
  }
};
