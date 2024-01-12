import showdown from "showdown";
import jsdom from "jsdom";
import sanitizeHtml from "sanitize-html";
import { getUserInfoFromToken } from "./auth.js";
import Note from "../models/notes.js";

const mdToHtml = (body) => {
  var convertor = new showdown.Converter();

  var tb = convertor.makeHtml(body);

  const clean = sanitizeHtml(tb);

  return clean;
};

const htmlToMd = (body) => {
  const dom = new jsdom.JSDOM();
  const converter = new showdown.Converter();

  const md = converter.makeMarkdown(body, dom.window.document);
  return md;
};

export const getAllNotes = async (req, res) => {
  var { id } = getUserInfoFromToken(req.cookies.auth);

  const re = await Note.find({ uid: id }).sort({ _id: -1 });

  res.render("notes/notes", { notes: re });
};

export const cleanFormHtml = (req, res) => {
  res.render("notes/note-form", { id: undefined, body: undefined });
};

export const addNote = async (req, res) => {
  const { body } = req.body;

  const { id } = getUserInfoFromToken(req.cookies.auth);

  const clean = mdToHtml(body);

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

export const editNoteHtml = async (req, res) => {
  const { id } = req.params;

  const a = getUserInfoFromToken(req.cookies.auth);

  const re = await Note.findById(id);

  if (re.uid != a.id) {
    res.status(401).send("Cannot delete someone else's note");
    return;
  }

  const body = htmlToMd(re.body);

  res.set("HX-trigger", "showUrself").render("notes/note-form", { id, body });
};

export const editNote = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  const a = getUserInfoFromToken(req.cookies.auth);

  const re = await Note.findById(id);

  if (re.uid != a.id) {
    res.status(401).send("Cannot delete someone else's note");
    return;
  }

  const clean = mdToHtml(body);

  await Note.updateOne({ _id: id }, [{ $set: { body: clean } }]);
  res.set("HX-trigger", "clean").render("notes/note", { body: clean, id });
};
