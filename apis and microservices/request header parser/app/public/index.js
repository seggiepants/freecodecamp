function onInit() {
    var url = "api/whoami";
    var server = "http://localhost";
    var port = "3000";

    fetch(server + ':' + port + '/' + url)
      .then(response => response.json())
      .then(data => {
          if (data.hasOwnProperty("error")) {
            document.getElementById("results").style["display"] = "none";
            document.getElementById("error").style["display"] = "inline-block";
            document.getElementById("error").innerText = data.error;
  
          } else {
            document.getElementById("results").style["display"] = "inline-block";
            document.getElementById("errors").style["display"] = "none";
            var results = document.getElementById("results");
            // Clear out the nodes.
            while (results.childNodes.length > 0) {
                results.removeChild(results.childNodes[0]);
            }

            var keys = Object.keys(data);
            for(var i = 0; i < keys.length; i++) {
                let elem = document.createElement("li");
                elem.innerHTML = `<strong>${keys[i]}</strong>: ${data[keys[i]]}`;
                results.appendChild(elem);
            }
          }
      });
  }