const Express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = Express();
app.use(cors());

const USERNAME = encodeURIComponent("prasannamb1632");
const PASSWORD = encodeURIComponent("PrasannaBalaji@7890");
const CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.r7f64w2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const DATABASENAME = "todoappdb";
let database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      console.error('Failed to connect to the database:', error);
      return;
    }
    database = client.db(DATABASENAME);
    console.log("MongoDB Connection Successful");
  });
});

// Define the endpoint to get notes
app.get('/api/todoapp/GetNotes', (request, response) => {
  database.collection("todoappcollection").find({}).toArray((error, result) => {
    if (error) {
      response.status(500).send('Failed to retrieve notes');
      return;
    }
    response.send(result);
  });
});

app.post('/api/todoapp/AddNotes', multer().none(), (request, response) => {
  database.collection("todoappcollection").countDocuments({}, function (error, numOfDocs) {
    database.collection("todoappcollection").insertOne({
      id: (numOfDocs + 1).toString(),
      description: request.body.newNotes
    }, (err, result) => {
      if (err) {
        response.status(500).json("Failed to add note");
      } else {
        response.json("Added Successfully");
      }
    });
  });
});

app.delete('/api/todoapp/DeleteNotes', (request, response) => { // Fix: ensure the path starts with '/'
  console.log("Deleting note with id:", request.query.id); // Debugging information
  database.collection("todoappcollection").deleteOne({
    id: request.query.id
  }, (err, result) => {
    if (err) {
      response.status(500).json("Failed to delete note");
    } else {
      response.json("Deleted Successfully");
    }
  });
});
