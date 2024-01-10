import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
  uid: String,
  body: String,
});

const Note = mongoose.model("Note", notesSchema);

export default Note;
