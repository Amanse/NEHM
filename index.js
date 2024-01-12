import express from "express";
import {
  signup,
  login,
  logout,
  validateUser,
  getUserInfoFromToken,
} from "./handlers/auth.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  addNote,
  cleanFormHtml,
  deleteNote,
  editNote,
  editNoteHtml,
  getAllNotes,
} from "./handlers/notes.js";

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

async function db() {
  await mongoose.connect(process.env.MONGOOSE_URI);
}

db()
  .then((res) => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(`error ${err}`);
  });

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
    if (req.path == "/login" || req.path == "/signup") {
      res.redirect("/");
    }
    next();
  } else {
    res.clearCookie("auth");
    res.status(401).redirect("/login");
  }
};

const alreadyAuth = async (req, res, next) => {
  const isV = await validateUser(req.cookies.auth);
  if (req.isAuthenticated && isV) {
    if (req.path == "/login" || req.path == "/signup") {
      res.redirect("/");
    }
    next();
  }
  next();
};

app.get("/", isAuthenticated, (req, res) => {
  var { email } = getUserInfoFromToken(req.cookies.auth);

  res.render("index", { email });
});

app.get("/signup", alreadyAuth, (req, res) => res.render("auth/signup"));
app.get("/login", alreadyAuth, (req, res) => res.render("auth/login"));
app.get("/logout", logout);
app.get("/notes", isAuthenticated, getAllNotes);
app.get("/notes/edit/:id", editNoteHtml);
app.get("/notes/clean-form", cleanFormHtml);

app.post("/signup", signup);
app.post("/login", login);
app.post("/notes/add", addNote);
app.post("/notes/delete/:id", deleteNote);

app.put("/notes/edit/:id", editNote);

app.listen("8080", () => {
  console.log("listening on 8080");
});
