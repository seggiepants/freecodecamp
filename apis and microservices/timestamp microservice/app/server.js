var express = require('express');
var app = express();

app.get("/api/timestamp/:dateString?", (req, res) => {  
  var timeStamp;
  if (req.params.dateString == null) {
    timeStamp = new Date();    
  } else {
    timeStamp = new Date(req.params.dateString);
  }
  
  if ((timeStamp != "Invalid Date") && (!isNaN(timeStamp))) {
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

app.get("/", (req, res) => {
  res.send("Hello World.");
});

var listener = app.listen(process.env.PORT || 3000 , () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
