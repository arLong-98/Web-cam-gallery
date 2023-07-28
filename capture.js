const colorMap = {
  yellow: "#ffa50052",
  brown: "#a52a2a59",
  pink: "#ffc0cb57",
  transparent: "transparent",
};
const CAPTURE_BUTTON = document.querySelector(".capture-button");

CAPTURE_BUTTON.addEventListener("click", captureImage);

function captureImage(e) {
  // we are drawing our image on canvas using a frame from the video stream
  const canvas = document.querySelector("canvas");
  canvas.width = VIDEO_ELEMENT.videoWidth;
  canvas.height = VIDEO_ELEMENT.videoHeight;
  const canvasCtx = canvas.getContext("2d");

  const filterClass = FILTER_LAYER.classList[0];

  // draw a 2d image using canvas context
  canvasCtx.drawImage(VIDEO_ELEMENT, 0, 0, canvas.width, canvas.height);

  // fillStyle to add a colored filter on our downloaded image
  canvasCtx.fillStyle = colorMap[filterClass] || "transparent";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  //generate a url from canvas
  const imageUrl = canvas.toDataURL("image/jpeg");

  // save image to indexed db
  if (DB.db) {
    const transaction = DB.db.transaction("image", "readwrite");
    const imageStore = transaction.objectStore("image");
    const imageObject = {
      id: generateFileName("photo"),
      url: imageUrl,
    };

    imageStore.add(imageObject);
  }

  //download the url
  //   downloadUrl(imageUrl, generateFileName("photo"));
}
