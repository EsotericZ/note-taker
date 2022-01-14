const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require("./helpers/uuid");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(`Error reading file from disk: ${err}`);
            } else {
                const databases = JSON.parse(data);
                databases.push(newNote);
                const noteString = JSON.stringify(databases);
                fs.writeFile("./db/db.json", noteString, (err) =>
                err
                    ? console.error(err)
                    : console.log("Note has been written to JSON file")
                );
                res.json(JSON.parse(noteString));
            } 
        });
    };
});

app.delete('/api/notes/:id', (req, res) => {
    let noteString = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    let noteID = (req.params.id).toString();
    noteString = noteString.filter (note => {
        return note.id != noteID;
    })
    fs.writeFileSync('./db/db.json', JSON.stringify(noteString));
    res.json(noteString);
});

app.get('*', (req, res) => {
    res.redirect('index.html');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});