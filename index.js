import express from "express";
import { signup, login } from "./handlers/auth.js";
import cookieParser from "cookie-parser";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const { auth } = req.cookies;
  if (auth) {
    req.isAuthenticated = true;
  } else {
    req.isAuthenticated = false;
  }
  next();
});

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    next();
  } else {
    res.status(401).redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => res.render("auth/signup"));
app.get("/login", (req, res) => res.render("auth/login"));
app.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.set("hx-location", "/login").status(200).send();
});

app.post("/signup", signup);
app.post("/login", login);

app.get("/check", (req, res) => {
  res.render("button");
});

app.listen("8080", () => {
  console.log("listening on 8080");
});
