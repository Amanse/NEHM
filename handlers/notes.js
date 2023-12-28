import db from "../lib/db.js";
import { getUserInfoFromToken } from "./auth.js";

export const getAllNotes = async (req, res) => {
  const d = await db;

  var { id } = getUserInfoFromToken(req.cookies.auth);
  console.log(id);

  const re = await d.all("SELECT body FROM notes where uid=?", id);

  res.render("notes/notes", { notes: re });
};
