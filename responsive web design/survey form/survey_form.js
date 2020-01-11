function dostuff() {
  alert('stuff');
  return false;
}

function fullTimePartTime() {
  partTimeExtra = document.getElementById("part-time-extra");
  if (document.getElementById("part-time").checked) {
    partTimeExtra.style.display = "block";
    whatElseDoYouDoForALiving();
  } else {
    partTimeExtra.style.display = "none";
  } 
}

function whatElseDoYouDoForALiving() {
  document.getElementById("house-wife-extra").style.display = 
    document.getElementById("house-wife").checked ? "block" : "none";

  document.getElementById("study-extra").style.display = 
    document.getElementById("study").checked ? "block" : "none";

  document.getElementById("other-job-extra").style.display = 
    document.getElementById("other-job").checked ? "block" : "none";

}

function sameResidence() {
  document.getElementById("same-residence-no-extra").style.display = 
    document.getElementById("same-residence-no").checked ? "block" : "none";
}

function jobLength() {
  document.getElementById("zero-to-five-months-extra").style.display = 
    document.getElementById("zero-to-five-months").checked ? "block" : "none";

  document.getElementById("over-five-months-extra").style.display = 
    document.getElementById("over-five-months").checked ? "block" : "none";
}

function otherToothpaste() {
  document.getElementById("toothpaste-brand").style.display = 
    document.getElementById("other-toothpaste").checked ? "block" : "none";
}

function init() {
  // Set initial form state.
  fullTimePartTime();
  whatElseDoYouDoForALiving();
  sameResidence();
  jobLength();
  otherToothpaste();
}