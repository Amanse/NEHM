CREATE TABLE notes(id INTEGER PRIMARY KEY, uid INTEGER NOT NULL, body TEXT NOT NULL, FOREIGN KEY(uid) REFERENCES users(id))
