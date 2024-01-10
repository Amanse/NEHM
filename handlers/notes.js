import showdown from "showdown";
import sanitizeHtml from "sanitize-html";
import { getUserInfoFromToken } from "./auth.js";
import Note from "../models/notes.js";

export const getAllNotes = async (req, res) => {
  var { id } = getUserInfoFromToken(req.cookies.auth);

  const re = await Note.find({ uid: id }).sort({ _id: -1 });

  res.render("notes/notes", { notes: re });
};

export const addNote = async (req, res) => {
  const { body } = req.body;

  const { id } = getUserInfoFromToken(req.cookies.auth);
  var convertor = new showdown.Converter();

  var tb = convertor.makeHtml(body);

  const clean = sanitizeHtml(tb);
  const newNote = Note({
    uid: id,
    body: clean,
  });

  const r = await newNote.save();

  res.render("notes/note", { body: clean, id: r._id });
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  const a = getUserInfoFromToken(req.cookies.auth);

  const re = await Note.findById(id);

  if (re.uid != a.id) {
    res.status(401).send("Cannot delete someone else's note");
    return;
  }

  await Note.deleteOne(re);
  res.send("success");
};
