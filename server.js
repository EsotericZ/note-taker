const express = require('express');
const path = require('path');
const fs = require('fs');
const dbData = require('./db/db.json');
const PORT = 3001;

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

app.get('/api/notes', (req, res) => res.json(dbData));



app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
        const newNote = {
            title,
            text,
            // review_id: uuid(),
        };


        // Convert the data to a string so we can save it
        const noteString = JSON.stringify(newNote);

        // Write the string to a file
        // fs.writeFile(`./db/db.json`, noteString, (err) =>
        fs.appendFile(`./db/db.json`, noteString, (err) =>
        err
            ? console.error(err)
            : console.log(
                `Review for ${newNote.title} has been written to JSON file`
            )
        );



  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });
  





app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});