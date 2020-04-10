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
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var shortenerSchema = new mongoose.Schema({
    _id: Number,
    url:  {type: String, required: true}, // String is shorthand for {type: String}
  });

var counterSchema = new mongoose.Schema({
  _id: String
  , sequence_value: Number,
})

const Shortener = mongoose.model('Shortener', shortenerSchema);
const Counter = mongoose.model('Counter', counterSchema);

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

app.get("/api/shorturl/:id?", (req, res) => {
  // Check to see if the id exists, if so, return the associated url.  
  if (req.params.id === null) {    
    return done('did not receive a url to lookup.');
  } else if (!isNaN(req.params.id)) {
    Shortener.findById(parseInt(req.params.id), (error, data) => {
      if (error) return Promise.reject(error);
      res.status(301);
      let url = data.url;
      if (url.search('://') == -1) {
        url = 'http://' + url;
      }
      res.redirect(url);
    });
  } else {
    return res.json({error: "Unable to parse."});
  }
}).post("/api/shorturl/:id?", (req, res) => {
  if (req.params.id == 'new') {
    let newURL = decodeURIComponent(req.body.url);
    let url = new URL(newURL);
    dns.lookup(url.hostname, { family: 0, all: false}, (err, address, family) => {
      if (err === undefined || err === null) {
        GetNextSequenceValue("shortener").then(data => {
          let newCounter = data.sequence_value;
          let shortURL = Shortener({
            _id: newCounter
            , url: newURL
          });
          shortURL.save((error, data) => {
            if (error) return res.json({error: error});
            res.json({
            original_url: newURL
            ,short_url: root_url + 'api/shorturl/' + newCounter
            });
          });
        }
      )} else {
        res.json({error: err});
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Application listening on port ${port} ...`);
});

async function GetNextSequenceValue(sequenceName){
  return Counter.findOneAndUpdate({_id: sequenceName}, {$inc:{sequence_value:1}}, {new: true, upsert: true, useFindAndModify: false}, (error, data) => {
    if (error) 
      return Promise.reject({error: error});
    else
      return Promise.resolve(data);
  })
}


