const RECORDING_STATE = {
  isRecording: false,
  currentMediaRecorder: null,
  timerId: null,
  counter: 0,
};

const VIDEO_ELEMENT = document.querySelector("#video"); // video element is used to recive the stream from web cam
const TIMER_ELEMENT = document.querySelector(".timer");
const FILTER_CONTAINER = document.querySelector(".filter-container");
const FILTER_LAYER = document.querySelector("#filter-layer");

getAccessToUserMedia();

async function getAccessToUserMedia() {
  // here we request permission for video and audio streaming
  // and then inject the stream from webcam to our video element

  try {
    const responseStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    // responseStream is an instance of MediaStream object

    if ("srcObject" in VIDEO_ELEMENT) {
      VIDEO_ELEMENT.srcObject = responseStream;
    } else {
      VIDEO_ELEMENT.src = URL.createObjectURL(responseStream);
    }

    RECORDING_STATE.currentMediaRecorder = new MediaRecorder(responseStream);
  } catch (error) {
    console.log(error);
    // TODO : handle error
  }
}

function startTimer() {
  function displayTimer() {
    let totalseconds = RECORDING_STATE.counter;

    let hours = Number.parseInt(totalseconds / 3600);
    totalseconds = totalseconds % 3600; // re assign with left seconds after taking out hours

    let minutes = Number.parseInt(totalseconds / 60);
    totalseconds = totalseconds % 60;

    let seconds = totalseconds;

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    TIMER_ELEMENT.innerHTML = `${hours}:${minutes}:${seconds}`;
    RECORDING_STATE.counter = totalseconds + 1;
  }

  RECORDING_STATE.timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
  TIMER_ELEMENT.innerHTML = "00:00:00";
  clearInterval(RECORDING_STATE.timerId);
}

function generateFileName(type) {
  const currentDate = new Date();
  let fileNameString = `${currentDate.getDay()}_${currentDate.getMonth()}_${currentDate.getFullYear()}_${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getMilliseconds()}`;

  if (type === "recording") {
    return `${type}_${fileNameString}.mp4`;
  }

  if (type === "photo") {
    return `${type}_${fileNameString}.jpeg`;
  }

  return "stream";
}

function downloadUrl(url, name) {
  const anchorEle = document.createElement("a");
  anchorEle.href = url;
  anchorEle.download = name;
  anchorEle.click();
}

FILTER_CONTAINER.addEventListener("click", (event) => {
  const targetedElement = event.target;

  const targetClassList = targetedElement.classList;

  // this filter layer is used for the ui
  // we will fill the canvas with color to apply the required filter color on our recorded video/captured photo
  if (targetClassList.contains("yellow")) {
    FILTER_LAYER.setAttribute("class", "yellow");
  } else if (targetClassList.contains("pink")) {
    FILTER_LAYER.setAttribute("class", "pink");
  } else if (targetClassList.contains("brown")) {
    FILTER_LAYER.setAttribute("class", "brown");
  } else if (targetClassList.contains("transparent")) {
    FILTER_LAYER.setAttribute("class", "transparent");
  }
});
