const RECORD_BUTTON = document.querySelector(".record-button");

RECORD_BUTTON.addEventListener("click", toggleRecording);

function toggleRecording() {
  const { isRecording, currentMediaRecorder } = RECORDING_STATE;

  if (currentMediaRecorder === null) return;

  if (!isRecording) {
    const data = [];

    // register dataAvailable event
    currentMediaRecorder.ondataavailable = (event) => {
      data.push(event.data);
    };

    // register on start event
    currentMediaRecorder.onstart = () => {
      // do something when recording has started
      RECORDING_STATE.isRecording = true;
      updateRecordButtonState();
    };

    //register on stop event
    currentMediaRecorder.onstop = () => {
      //do something when recording has stopped
      RECORDING_STATE.isRecording = false;
      updateRecordButtonState();
      //convert data chunks to blob
      let blob = new Blob(data, { type: "video/mp4" });

      if (DB.db) {
        let dbTransaction = DB.db.transaction("video", "readwrite");
        let videoStore = dbTransaction.objectStore("video");
        const videoEntry = {
          id: generateFileName("recording"),
          blobData: blob,
        };

        videoStore.add(videoEntry);
      }
      //   const videoUrl = URL.createObjectURL(blob);

      //download video
      //   downloadUrl(videoUrl, generateFileName("recording"));
    };
    startTimer();
    currentMediaRecorder.start(); // start recording data in a blob
  } else {
    stopTimer();
    currentMediaRecorder.stop();
  }
}

function updateRecordButtonState() {
  RECORD_BUTTON.classList.toggle("record-active");
}
