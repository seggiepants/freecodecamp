const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config(); // skip on glitch.
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

app.use(cors());

var userSchema = new mongoose.Schema({
  username:  {type: String, required: true}, // String is shorthand for {type: String}
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/exercise/new-user", (req, res) => {
  console.log('new user');
    let username = decodeURIComponent(req.body.username);    
    console.log(username);
    User.findOneAndUpdate({username: username}, {username: username}, {new: true, upsert: true, useFindAndModify: false}, (error, data) => {
      if (error) {
        console.log(error);
        return res.json({error: error});
      } else {
        console.log(data);
        return res.json({_id: data._id, username: data.username});
      }
    });
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
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
