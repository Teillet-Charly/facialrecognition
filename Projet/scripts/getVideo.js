var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) { //used to insure that getUserMedia work on the used browser
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}