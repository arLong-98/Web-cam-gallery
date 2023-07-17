const RECORDING_STATE = {
  isRecording: false,
  currentMediaRecorder: null,
  timerId: null,
  counter: 0,
};

const VIDEO_ELEMENT = document.querySelector("#video"); // video element is used to recive the stream from web cam
const TIMER_ELEMENT = document.querySelector(".timer");

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
