console.log("hello from gallery");
DB.registerListener(loadGallery);

const ASSET_CONTAINER = document.querySelector(".asset-container");

// use event delegation to avoid attaching event listeners to multiple download and delete buttons
ASSET_CONTAINER.addEventListener("click", function handleClick(e) {
  const parentNode = e.target.parentNode;
  const fileId = parentNode.id;
  const asset = parentNode.querySelector(".asset");
  if (e.target.classList.contains("download")) {
    downloadUrl(asset.src, fileId);
  }

  if (e.target.classList.contains("delete")) {
  }
});

function loadGallery() {
  if (DB.db) {
    // get videos
    const { db } = DB;
    const videoTransaction = db.transaction("video", "readonly");
    const videoStore = videoTransaction.objectStore("video");
    const videoRequest = videoStore.getAll(); //event driven

    videoRequest.onsuccess = (e) => {
      const videoResult = videoRequest.result;
      videoResult.forEach(({ id, blobData }) => {
        // id is the filename
        //will use this id to identify the file
        const mediaCard = createMediaCard("recording", element);
        mediaCard.setAttribute("id", id);
        mediaCard.querySelector(".asset").src = URL.createObjectURL(blobData);
        ASSET_CONTAINER.appendChild(mediaCard);
      });
    };

    const imageTransaction = db.transaction("image", "readonly");
    const imageStore = imageTransaction.objectStore("image");
    const imageRequest = imageStore.getAll(); //event driven

    imageRequest.onsuccess = (e) => {
      const imageResult = imageRequest.result;
      imageResult.forEach(({ id, url }) => {
        const mediaCard = createMediaCard("photo");
        mediaCard.setAttribute("id", id);
        mediaCard.querySelector(".asset").src = url;
        ASSET_CONTAINER.appendChild(mediaCard);
      });
    };
  }
}

function createMediaCard(type) {
  const mediaCard = document.createElement("div");
  mediaCard.classList.add("media-card");

  let assetTag = "";

  if (type === "photo") {
    assetTag = "<img class='asset' src='' />";
  } else if (type === "recording") {
    assetTag = "<video class='asset' autoplay loop src='' ></video>";
  }

  mediaCard.innerHTML = `
    ${assetTag}
    <button class="action-btn download" >DOWNLOAD</button>
    <button class="action-btn delete" >DELETE</button>

  `;

  return mediaCard;
}

function downloadUrl(url, name) {
  const anchorEle = document.createElement("a");
  anchorEle.href = url;
  anchorEle.download = name;
  anchorEle.click();
}
