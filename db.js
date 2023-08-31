// Open a database
// Create object store

let db;
let openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success", e => {

    console.log("DB success");
    db = openRequest.result;
})
openRequest.addEventListener("error", e => {

    console.log("DB error", err);
})
openRequest.addEventListener("upgradeneeded", e => {

    console.log("DB upgraded & also for intial DB creation.");
    db = openRequest.result;

    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });
})