var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
app.use(bodyParser.urlencoded({extend: false}));
app.use(cors());

app.get("/api/whoami", (req, res) => {    
  console.log(req.headers);
  var results = {};

  // Fill in the ordinary keys.
  /*
  var keys = Object.keys(req.headers);
  for (var i = 0; i < keys.length; i++) {
      results[keys[i]] = req.headers[keys[i]];
  }
  */

  // IP Address
  if (!Object.hasOwnProperty("ipaddress")) {
    results["ipaddress"] = req.ip; //req.header('x-forwarded-for') || req.connection.remoteAddress;; // || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  }
  
  // Software == user-agent?
  if (!Object.hasOwnProperty("software")) {
    results["software"] = req.headers["user-agent"] || "unknown";
  }

  // Software == user-agent?
  if (!Object.hasOwnProperty("language")) {
    results["language"] = req.headers["accept-language"] || "unknown";
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(results));
});

app.use("/", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

var listener = app.listen(process.env.PORT || 3000 , () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
