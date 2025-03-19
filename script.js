const apiKey = "860542969d7147a9b9f4805c715cf669";  // مفتاح VoiceRSS API

function speak() {
    let text = document.getElementById("textInput").value;
    let lang = document.getElementById("language").value;
    let speed = document.getElementById("speed").value;
    let pitch = document.getElementById("pitch").value;

    if (text.trim() === "") {
        alert("❌ يرجى إدخال النص أولاً!");
        return;
    }

    responsiveVoice.speak(text, lang, { rate: speed, pitch: pitch });
}

function saveAudio() {
    let text = document.getElementById("textInput").value;
    let lang = document.getElementById("language").value;

    if (text.trim() === "") {
        alert("❌ يرجى إدخال النص قبل الحفظ!");
        return;
    }

    let audioURL = `https://api.voicerss.org/?key=${apiKey}&hl=${lang}&src=${encodeURIComponent(text)}`;

    let link = document.createElement("a");
    link.href = audioURL;
    link.download = "audio.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// تحويل النص إلى فيديو مع الصوت
function generateVideo() {
    let text = document.getElementById("textInput").value;
    let lang = document.getElementById("language").value;

    if (text.trim() === "") {
        alert("❌ يرجى إدخال النص قبل إنشاء الفيديو!");
        return;
    }

    let audioURL = `https://api.voicerss.org/?key=${apiKey}&hl=${lang}&src=${encodeURIComponent(text)}`;

    // تحميل صورة خلفية للفيديو
    let backgroundURL = "https://source.unsplash.com/800x400/?nature,abstract";

    fetch(backgroundURL)
        .then(response => response.blob())
        .then(imageBlob => {
            let imageURL = URL.createObjectURL(imageBlob);

            let video = document.createElement("video");
            video.controls = true;

            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            let img = new Image();
            img.src = imageURL;

            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                let audio = new Audio(audioURL);
                audio.onloadedmetadata = function () {
                    let duration = audio.duration;

                    let stream = canvas.captureStream();
                    let mediaRecorder = new MediaRecorder(stream);
                    let chunks = [];

                    mediaRecorder.ondataavailable = function (event) {
                        chunks.push(event.data);
                    };

                    mediaRecorder.onstop = function () {
                        let blob = new Blob(chunks, { type: "video/webm" });
                        let videoURL = URL.createObjectURL(blob);
                        document.getElementById("generatedVideo").src = videoURL;
                    };

                    mediaRecorder.start();
                    setTimeout(() => mediaRecorder.stop(), duration * 1000);
                };

                audio.play();
            };
        })
        .catch(error => console.error("❌ فشل تحميل الخلفية:", error));
}
