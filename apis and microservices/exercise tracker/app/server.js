const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // skip on glitch.
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extend: false}));
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

var userSchema = new mongoose.Schema({
  username:  {type: String, required: true}, // String is shorthand for {type: String}
});
const User = mongoose.model('User', userSchema);

// app.use(bodyParser.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/exercise/new-user", (req, res) => {
  let username = decodeURIComponent(req.body.username);  
  console.log(`username: ${username}`);
  //console.log(User);
  User.findOne({'username': username}, function(error, data) {
    // Why do we never get a response?
      /*
      if (error) {
        console.log(`findOne - error: ${error}`);
        return res.json({'error': error});
      }
      */
      /*
      if (data) {
        // We have some data
        console.log(`findOne - existing - data: ${data}`);
        return res.json({'error': 'username taken.'});
      } else {
        // New data
        console.log(`findOne - new: ${data}`);
        User({username: username}).save((error, data) => {
          if (error) {
            console.log(`save error: ${error}`);
            return res.json({'error': error});
          }
          console.log(`save: ${data}`);
          return res.json({'_id': data._id, 'username': data.username});
        });
      }
      */
     console.log('error:');
     console.log(error);
     console.log('data');
     console.log(data);
     return res.json({'message': 'got this far.'});
  });
  console.log('end of findone');
});
  
app.get("/api/exercise/users/:username?", (req, res) => {
  let username = decodeURIComponent(req.body.username || '');
  let filter = {};
  // Add a filter if we passed one in.
  if (username !== null) {
    filter['username'] = username;
  }
console.log('filter');
console.log(filter);
  User.find(filter, (error, docs) => {
    console.log('callback');
    if (error) {
      return res.json({error: error});
    } else {
      return res.json({users: docs});
    }
  });
})

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'});
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

