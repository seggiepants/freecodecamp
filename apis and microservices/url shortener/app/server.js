'use strict';

var express = require('express');
var dns = require('dns');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config(); // skip on glitch.
var cors = require('cors');
var app = express();
app.use(bodyParser.urlencoded({extend: false}));
app.use(cors());

const db = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var shortenerSchema = new mongoose.Schema({
    _id: Number,
    url:  {type: String, required: true}, // String is shorthand for {type: String}
  });

const Shortener = mongoose.model('Shortener', shortenerSchema);

/*
look at: https://jelly-iris-pea.glitch.me
for my mongoose previous work.
*/

// Basic Configuration 
var port = process.env.PORT || 3000;
var root_url = "http://localhost:" + port + "/"; // localhost
// var root_url = "https://developing-rumbling-gatsby.glitch.me/"; // glitch

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/shorturl/:id?", (req, res, next) => {
  // Check to see if the id exists, if so, return the associated url.  
  if (req.params.id === null) {    
    return done('did not receive a url to lookup.');
  } else if (!IsNaN(req.params.id)) {
    Shortener.findById(parseInt(req.params.id), (error, data, next) => {
      if (error) return done(error);
      if (data.hasOwnProperty('url')) {
        res.redirect(data.url);
      } else {
        return done(`cannot find a shortened value for ${req.params.id}.`);
      }
      next();
    });
  } else {
    return done("Unable to parse.");
    next();
  }
});

app.post("/api/shorturl/:id?", (req, res, next) => {
  if (req.params.id == 'new') {
    let newURL = decodeURIComponent(req.body);
    dns.lookup(newURL, { family: 0, all: false}, (err, address, family) => {
      if (err !== undefined && err !== null) {
      let newID = getNextSequenceValue("shortener");
      
      let shortURL = Shortener({
        _id: newID
        , url: newURL
      });
      shortURL.save((error, data) => {
        if (error) return done(error);
        done(null, data);
      });
    
      res.send({
        original_url: newURL
        ,short_url: newID
        });
      } else {
        res.send({error: err});
      }
    });
    next();
  }
});

app.listen(port, () => {
  console.log(`Application listening on port ${port} ...`);
});

function getNextSequenceValue(sequenceName){
  console.log('db:');
  console.log(db);
  var sequenceDocument = db.counters.findOneAndUpdate({
    query:{_id: sequenceName },
    update: {$inc:{sequence_value:1}},
    new:true
  });
  return sequenceDocument.sequence_value;
}

