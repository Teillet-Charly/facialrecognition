$(document).ready(function(){
  getVideo();
});

const video = document.querySelector("#videoElement");
const canvas = document.getElementById('overlay');

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

//Test function wich search a face and compute it landmarks
async function checkReco(){
  const detection = await faceapi.detectSingleFace(video).withFaceLandmarks();

  const displaySize = {width: video.videoWidth, height: video.videoHeight};
  faceapi.matchDimensions(canvas, displaySize);

  if(detection){
    const resizedDetections = faceapi.resizeResults(detection, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  };
  setTimeout(() => checkReco(), 150);
};

//Function used to recognise a person via facial recognition
async function faceRecognition(label){
  // fetch image data from urls and convert blob to HTMLImage element
  const imgUrl = `/images/${label}.png`;
  const img = await faceapi.fetchImage(imgUrl);

  //set the overlay
  const displaySize = {width: video.videoWidth, height: video.videoHeight};
  faceapi.matchDimensions(canvas, displaySize); 

  const imgReco = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();   // detect face in the image
  const videoReco = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor(); //detect face in the video

  if (imgReco && videoReco) {
    const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(label, [imgReco.descriptor]); //creation of labeled reference descriptors
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors); // initiate face matcher with information from image
    
    const bestMatch = faceMatcher.findBestMatch(videoReco.descriptor);
      
    const drawBox = new faceapi.draw.DrawBox(videoReco.detection.box, { label: bestMatch.toString() })
    drawBox.draw(canvas)

    console.log('Reconnaissance : ' + bestMatch.toString());
  }else{
    console.log(`no faces detected on video`);
  };

  setTimeout(() => faceRecognition(label), 300);
}

