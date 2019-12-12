var mykey = config.MY_KEY;

var firebaseConfig = {
  apiKey: MY_KEY,
  authDomain: "train-schedule-8499d.web.app",
  databaseURL: "https:train-schedule-8499d.firebaseapp.com",
  projectId: "train-schedule-8499d",
  storageBucket: "https:train-schedule-8499d.web.app/",
  messagingSenderId: "",
  appId: "project-257037886748",
};

firebase.initializeApp(firebaseConfig);

// Created a shortcut for firebase.database()
let database = firebase.database()

// Declared variables that are empty & will be given values upon the click functions
let name = ""
let destination = ""
let firstTrainTime = ""
let frequency = ""

// Will extract the values from the form and check to see if they are valid
$("#submit-train").on("click", function (event) {

  event.preventDefault();
  name = $("#train-name-input").val().trim()
  destination = $("#destination-input").val().trim()
  firstTrainTime = $("#first-train-input").val().trim()
  frequency = $("#frequency-input").val().trim()

  if (name.length < 1 || destination.length < 1 || firstTrainTime.length !== 5 || frequency.length < 1) {
    $(".error").empty()
    $(".error").append("**You Must Insert Valid Fields**")
    return;
  }
  else {

    // Push my created object into the database if it passes the validation and formats the time
    firstTrainTime = moment(firstTrainTime, "HH:mm").format("x");
    database.ref("/New-Train").push({
      name,
      destination,
      firstTrainTime,
      frequency
    })

    $("#train-name-input").val("")
    $("#destination-input").val("")
    $("#first-train-input").val("")
    $("#frequency-input").val("")
    $(".error").empty()
  }

})

// Whenever page is loaded or another object is added, run the calculations
database.ref("/New-Train").on("child_added", function (snapshot) {

  let name = snapshot.val().name
  let destination = snapshot.val().destination
  let frequency = snapshot.val().frequency
  let firstTrainTime = moment(snapshot.val().firstTrainTime, 'x')

  let arrival, minutes;

  // Checks to see if the train is in the future or in the past
  if(moment().isBefore(firstTrainTime)){
    arrival = firstTrainTime.format("HH:mm a");
    minutes = firstTrainTime.diff(moment(), 'minutes') + 1
  } else {
    let remainder = Math.abs(moment().diff(firstTrainTime, 'minutes')) % frequency;
    minutes = frequency - remainder;
    arrival = moment().add(minutes, "minutes").format("hh:mm a")
  }


  // let remainder = moment().diff(moment(firstTrainTime,"X"), "minutes") % frequency;  
  // let minutes = frequency - remainder;
  // let arrival = moment().add(minutes, "minutes").format("hh:mm A");



  // Dynamically generates content based on what is in firebase & after calculations
  let newTr = $("<tr>")
  newTr.html(`<td>${name}</td><td>${destination}</td><td>${frequency}</td><td>${arrival}</td><td>${minutes}</td>`)

  $("#main-holder").append(newTr)

})
