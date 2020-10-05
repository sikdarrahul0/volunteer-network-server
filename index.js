const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2qyt.mongodb.net/Volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

  const collection = client.db("Volunteer").collection("list");
  const volunteerData = client.db("Volunteer").collection("volunteer-type-details");

  app.get('/getVolunteerInfo', (req, res)=>{
    volunteerData.find()
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.get('/allData', (req, res)=>{
      collection.find()
      .toArray((err, documents)=>{
          res.send(documents);
      })
  })

  app.get('/data', (req, res)=>{
      collection.find({email: req.query.email})
      .toArray((err, documents)=>{
          res.send(documents);
      })
  })
  app.post('/addEvent', (req, res)=>{
    volunteerData.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  app.post('/addVolunteerData', (req, res)=>{
      collection.insertOne(req.body)
      .then(result =>{
          res.send(result.insertedCount > 0);
      })
  })

  app.delete('/delete/:id', (req, res)=>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deleteCount > 0);
    })
  })
});



app.get('/', (req, res) => {
  res.send('Volunteer network Server')
})

app.listen( process.env.PORT || port)