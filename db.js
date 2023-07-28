// created a listener for gallery uisng object getter/setter
// register a listener and it will run everytime we set db value
const DB = {
  internalDb: null,
  dbListener: function () {},
  set db(value) {
    this.internalDb = value;
    this.dbListener();
  },
  get db() {
    return this.internalDb;
  },
  registerListener: function (callback) {
    this.dbListener = callback;
  },
};

openDatabase();

function openDatabase() {
  const openRequest = window.indexedDB.open("gallery-db", 2);

  openRequest.onsuccess = (event) => {
    console.log("DB success");
    DB.db = event.target.result;
  };

  openRequest.addEventListener("error", (e) => {
    console.log("DB error");
  });

  openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("DB upgraded and initial db creation");
    DB.db = openRequest.result;

    // key path is used for unique identification for all data objects inside object store
    DB.db.createObjectStore("video", { keyPath: "id" });
    DB.db.createObjectStore("image", { keyPath: "id" });
  });
}
