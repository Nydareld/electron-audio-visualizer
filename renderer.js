const {desktopCapturer} = require('electron')



onchange = function(stream) {
    console.log("here",stream);
    // var audio = navigator.mediaDevices.getUserMedia({ audio: true, video : false });

    // audio.then((stream)=>{

    var context = new AudioContext();
    var src = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    //analyser.connect(context.destination);

    var barNumber = 27;
    analyser.fftSize = 512;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var bufferByBar = Math.round(bufferLength/barNumber);
    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var ecart = 2;

    var barWidth = (WIDTH / barNumber) -ecart;
    var barHeight;
    var x = 0;

    console.log("bufferLength",bufferLength);
    console.log("bufferByBar",bufferByBar);
    console.log("barNumber",barNumber);
    console.log("barWidth",barWidth);

    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#0f0";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < barNumber; i++) {
            barHeight = 0
            for (var j = 0; j < bufferByBar; j++) {
                barHeight += dataArray[i*bufferByBar+j];
            }
            barHeight = barHeight/bufferByBar;

            var r = barHeight + (25 * (i/bufferLength));
            var g = 250 * (i/bufferLength);
            var b = 50;

            // var fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            var fillStyle = "#F00";

            ctx.fillStyle = fillStyle;
            // ctx.fillStyle = "#F00";
            ctx.fillRect(x, HEIGHT - 2*barHeight, barWidth, 2*barHeight);

            ctx.beginPath();
            ctx.arc(x+(barWidth/2), HEIGHT - 2*barHeight , barWidth/2, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.lineWidth = 0;
            ctx.strokeStyle = fillStyle;
            ctx.stroke();


            x += barWidth + ecart;
        }
    }

    renderFrame();
    // });
};


navigator.mediaDevices.getUserMedia({
    audio: true,
    video : false
})
.then(onchange)
.catch((e) => handleError(e))
function handleError (e) {
    console.log(e)
}


// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
