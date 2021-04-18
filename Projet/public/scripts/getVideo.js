$(document).ready(function(){
  getVideo();
});

var video = document.querySelector("#videoElement");

async function getVideo(){
  await faceapi.loadSsdMobilenetv1Model('/models');
  await faceapi.loadFaceLandmarkModel('/models');
  await faceapi.loadFaceRecognitionModel('/models');

  if (navigator.mediaDevices.getUserMedia) { //used to insure that getUserMedia work on the used browser
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
    }
}

async function onPlay(){
  const detection = await faceapi
    .detectSingleFace(video)
    .withFaceLandmarks();

  const displaySize = {width: video.videoWidth, height: video.videoHeight};
  const canvas = document.getElementById('overlay');
  faceapi.matchDimensions(canvas, displaySize);

  if(detection){
    const resizedDetections = faceapi.resizeResults(detection, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  };

  setTimeout(() => onPlay(), 150)
};


