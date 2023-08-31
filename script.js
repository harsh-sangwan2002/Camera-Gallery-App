let video = document.querySelector('video');
let recordBtnCont = document.querySelector('.record-btn-cont');
let captureBtnCont = document.querySelector('.capture-btn-cont');
let recordBtn = document.querySelector('.record-btn');
let captureBtn = document.querySelector('.capture-btn');
let timer = document.querySelector('.timer');
let allFilters = document.querySelectorAll('.filter');
let filterLayer = document.querySelector('.filter-layer');

let transparentColor = "transparent";

let constraints = {

    video: true,
    audio: true
}
let recordFlag = false;
let chunks = []; // video chunks

let recorder;

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

    video.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (e) => {

        chunks = [];
    })

    recorder.addEventListener("dataavailable", (e) => {

        chunks.push(e.data);
    })

    recorder.addEventListener("stop", (e) => {

        let blob = new Blob(chunks, { type: "video/mp4" });

        if (db) {

            let videoId = shortid();

            let dbTransaction = db.transaction("video", "readwrite");
            let videostore = dbTransaction.objectStore("video");

            let videoEntry = {

                id: `vid-${videoId}`,
                blobData: blob
            }

            videostore.add(videoEntry);
        }

    })

}).catch(err => {

    console.log("Error is: ", err);
})

recordBtnCont.addEventListener("click", (e) => {

    if (!recorder) return;

    recordFlag = !recordFlag;

    // start recording

    if (recordFlag) {

        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }

    // stop recording

    else {

        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})

captureBtnCont.addEventListener("click", e => {

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageUrl = canvas.toDataURL();

    if (db) {

        let imageId = shortid();

        let dbTransaction = db.transaction("image", "readwrite");
        let imagestore = dbTransaction.objectStore("image");

        let imageEntry = {

            id: `img-${imageId}`,
            url: imageUrl
        }

        imagestore.add(imageEntry);
    }

    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500);

})


let timerID;
let counter = 0; // total seconds

function startTimer() {

    function displayTimer() {

        timer.style.display = "block";

        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600; // remaining seconds

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60; // remaining seconds

        let seconds = totalSeconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;

    }

    timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {

    timer.style.display = "none";
    clearInterval(timerID);
    counter = 0;
    timer.innerText = `00:00:00`;
}

allFilters.forEach(filterEle => {

    filterEle.addEventListener("click", e => {

        transparentColor = getComputedStyle(filterEle).getPropertyValue('background-color');
        filterLayer.style.backgroundColor = transparentColor;
    })
})