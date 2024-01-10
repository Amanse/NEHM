import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  token: String,
});

const UserSession = mongoose.model("session", sessionSchema);

export default UserSession;
