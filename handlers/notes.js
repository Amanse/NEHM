import db from "../lib/db.js";
import showdown from "showdown";
import sanitizeHtml from "sanitize-html";
import { getUserInfoFromToken } from "./auth.js";

export const getAllNotes = async (req, res) => {
  const d = await db;

  var { id } = getUserInfoFromToken(req.cookies.auth);

  const re = await d.all(
    "SELECT id, body FROM notes where uid=? order by created_at desc",
    id,
  );

  res.render("notes/notes", { notes: re });
};

export const addNote = async (req, res) => {
  const d = await db;

  const { body } = req.body;

  const { id } = getUserInfoFromToken(req.cookies.auth);
  var convertor = new showdown.Converter();

  var tb = convertor.makeHtml(body);

  const clean = sanitizeHtml(tb);
  const r = await d.run(
    "Insert into notes (uid, body) values (?,?)",
    id,
    clean,
  );

  res.render("notes/note", { body: clean, id: r.lastID });
};

export const deleteNote = async (req, res) => {
  const d = await db;

  // console.log(req.body);
  // const { id } = req.body;
  // console.log(id);
  const { id } = req.params;

  const a = getUserInfoFromToken(req.cookies.auth);

  const re = await d.get("SELECT uid from notes where id = ?", id);

  if (re.uid != a.id) {
    res.status(401).send("Cannot delete someone else's note");
    return;
  }

  await d.run("delete from notes where id = ?", id);
  res.send("success");
};
