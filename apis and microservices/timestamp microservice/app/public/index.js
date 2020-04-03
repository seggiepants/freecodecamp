function onSubmit() {
  var url = "api/timestamp";
  var dateString = document.getElementById("dateString").value;  
  if (dateString.length > 0) {
    url = url + '/' + encodeURI(dateString.replace(/\//g, '-'));
  }
  fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty("error")) {
          document.getElementById("results").style["display"] = "none";
          document.getElementById("resultsError").style["display"] = "inline-block";
          document.getElementById("error").innerText = data.error;

        } else {
          document.getElementById("results").style["display"] = "inline-block";
          document.getElementById("resultsError").style["display"] = "none";
          document.getElementById("unix").innerText = data.unix;
          document.getElementById("utc").innerText = data.utc;
        }
    });

  return false;
}