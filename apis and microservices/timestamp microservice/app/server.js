var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
app.use(bodyParser.urlencoded({extend: false}));
app.use(cors());
app.use("/", express.static(__dirname + "/public"));

app.get("/api/timestamp/:dateString?", (req, res) => {  
  var timeStamp;
  console.log('Start');
  console.log(req.params.dateString);
  if (req.params.dateString == null) {
    timeStamp = new Date();    
  } else if (/\d{5,}/.test(req.params.dateString)) {
        console.log('Stuff');
    var timeInt = parseInt(req.params.dateString);
    console.log(timeInt);
    timeStamp = new Date(timeInt);
    console.log(timeStamp);
  }
  else
  {
    console.log('String->date');
    timeStamp = new Date(req.params.dateString);
  }
  
  if (timeStamp != "Invalid Date") {
    // Valid date
    res.send({
      "unix": timeStamp.getTime(),
      "utc": timeStamp.toUTCString()
    });
  } else {
    // Invalid date.
    res.send({
      "error": "Invalid Date",
    })
  }
});

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

var listener = app.listen(process.env.PORT || 3000 , () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
