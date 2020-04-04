var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
app.use(bodyParser.urlencoded({extend: false}));
app.use(cors());
app.use("/", express.static(__dirname + "/public"));

app.get("/api/whoami", (req, res) => {  
  console.log(req.headers);
  var results = "";
  var keys = Object.keys(req.headers);
  for (var i = 0; i < keys.length; i++) {
      if (i > 0) {
          results = results + ", ";
      }
      results = results + `"${keys[i]}": "${encodeURI(req.headers[keys[i]])}"`;
  }
  res.send("{" + results + "}");
});

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

var listener = app.listen(process.env.PORT || 3000 , () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
