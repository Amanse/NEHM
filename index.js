import express from "express";
import { signup, login, logout, validateUser } from "./handlers/auth.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.use((req, res, next) => {
  const { auth } = req.cookies;
  if (auth) {
    req.isAuthenticated = true;
  } else {
    req.isAuthenticated = false;
  }
  next();
});

const isAuthenticated = async (req, res, next) => {
  const isV = await validateUser(req.cookies.auth);
  if (req.isAuthenticated && isV) {
    next();
  } else {
    res.clearCookie("auth");
    res.status(401).redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  var dc = jwt.verify(req.cookies.auth, process.env.SECRET_TOKEN);
  res.render("index", { email: dc.email });
});

app.get("/signup", (req, res) => res.render("auth/signup"));
app.get("/login", (req, res) => res.render("auth/login"));
app.get("/logout", logout);

app.post("/signup", signup);
app.post("/login", login);

app.get("/check", (req, res) => {
  res.render("button");
});

app.listen("8080", () => {
  console.log("listening on 8080");
});
