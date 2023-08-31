setTimeout(() => {

    if (db) {

        // videos retrieval

        let videodbTransaction = db.transaction("video", "readonly");

        let videostore = videodbTransaction.objectStore("video");
        let videoRequest = videostore.getAll(); // Event driven

        videoRequest.onsuccess = (e) => {

            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach(videoObj => {

                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaEle.innerHTML = `
                
                <div class="media">
                  <video src="${url}" autoplay loop></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `

                galleryCont.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector('.delete');
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaEle.querySelector('.download');
                downloadBtn.addEventListener("click", downloadListener);
            })
        }

        // images retrieval
        let imagedbTransaction = db.transaction("image", "readonly");

        let imagestore = imagedbTransaction.objectStore("image");
        let imageRequest = imagestore.getAll(); // Event driven

        imageRequest.onsuccess = (e) => {

            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach(imageObj => {

                let mediaEle = document.createElement("div");
                mediaEle.setAttribute("class", "media-cont");
                mediaEle.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaEle.innerHTML = `
                
                <div class="media">
                  <img src="${url}"/>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `

                galleryCont.appendChild(mediaEle);

                let deleteBtn = mediaEle.querySelector('.delete');
                deleteBtn.addEventListener("click", deleteListener);
                let downloadBtn = mediaEle.querySelector('.download');
                downloadBtn.addEventListener("click", downloadListener);
            })
        }
    }

}, 50);

// UI removal and DB removal
function deleteListener(e) {

    let id = e.target.parentElement.getAttribute("id");

    if (id.slice(0, 3) === 'vid') {

        let videodbTransaction = db.transaction("video", 'readwrite');
        let videostore = videodbTransaction.objectStore('video');
        videostore.delete(id);
    }

    else if (id.slice(0, 3) === 'img') {

        let imagedbTransaction = db.transaction("image", 'readwrite');
        let imagestore = imagedbTransaction.objectStore('image');
        imagestore.delete(id);
    }

    e.target.parentElement.remove();
}

function downloadListener(e) {

    let id = e.target.parentElement.getAttribute("id");

    if (id.slice(0, 3) === 'vid') {

        let videodbTransaction = db.transaction("video", 'readwrite');
        let videostore = videodbTransaction.objectStore('video');
        let videoRequest = videostore.get(id);

        videoRequest.onsuccess = (e) => {

            let videoResult = videoRequest.result;

            let videoUrl = URL.createObjectURL(videoResult.blobData);

            let a = document.createElement("a");
            a.href = videoUrl;
            a.download = "stream.mp4";
            a.click();
        }
    }

    else if (id.slice(0, 3) === 'img') {

        let imagedbTransaction = db.transaction("image", 'readwrite');
        let imagestore = imagedbTransaction.objectStore('image');
        let imageRequest = imagestore.get(id);

        imageRequest.onsuccess = (e) => {

            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }

}