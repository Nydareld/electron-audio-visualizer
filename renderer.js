// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.onload = function() {

    onchange = function() {

        var audio = navigator.mediaDevices.getUserMedia({ audio: true, video : false });

        audio.then((stream)=>{

            var context = new AudioContext();
            var src = context.createMediaStreamSource(stream);
            var analyser = context.createAnalyser();

            var canvas = document.getElementById("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            var ctx = canvas.getContext("2d");

            src.connect(analyser);
            //analyser.connect(context.destination);

            analyser.fftSize = 256;

            var bufferLength = analyser.frequencyBinCount;
            console.log(bufferLength);

            var dataArray = new Uint8Array(bufferLength);

            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;

            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;
            var x = 0;

            function renderFrame() {
                requestAnimationFrame(renderFrame);

                x = 0;

                analyser.getByteFrequencyData(dataArray);

                ctx.fillStyle = "#0f0";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                for (var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];

                    var r = barHeight + (25 * (i/bufferLength));
                    var g = 250 * (i/bufferLength);
                    var b = 50;

                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillStyle = "#F00";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                    x += barWidth + 1;
                }
            }

            renderFrame();
        });
    };

    onchange();
};
