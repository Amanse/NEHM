import db from "../lib/db.js";
import { getUserInfoFromToken } from "./auth.js";

export const getAllNotes = async (req, res) => {
  const d = await db;

  var { id } = getUserInfoFromToken(req.cookies.auth);

  const re = await d.all(
    "SELECT body FROM notes where uid=? order by created_at desc",
    id,
  );

  res.render("notes/notes", { notes: re });
};

export const addNote = async (req, res) => {
  const d = await db;

  const { body } = req.body;

  const { id } = getUserInfoFromToken(req.cookies.auth);

  await d.run("Insert into notes (uid, body) values (?,?)", id, body);

  res.render("notes/note", { body });
};
