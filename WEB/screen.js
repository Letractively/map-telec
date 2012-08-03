var video;
var canvas;
var root;
 
function initScreen(){
    console.log('test');
    root = document.getElementById('screen');
    root.setAttribute('style', 'position:absolute;top:0;left:0');
    video = document.createElement('video');
    video.id = 'monitor';
    video.autoplay='autoplay';
    canvas = document.createElement('canvas');
    canvas.id = 'photo';
    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.setAttribute('value', 'Screen');
    button.addEventListener('click', screenshot, false);
    root.appendChild(video);
    root.appendChild(canvas);
    root.appendChild(button);
    navigator.getUserMedia('video', gotStream, noStream);
    console.log(video);
}
function gotStream(stream) {
    video.src = stream;
    video.onerror = function () {
        stream.stop();
    };
    stream.onended = noStream;
    video.onloadedmetadata = function () {
        console.log(video.videoWidth);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    };
}
function noStream() {
    document.getElementById('errorMessage').textContent = 'No camera available.';
}
function screenshot() {
    var i;
    canvas.getContext('2d').drawImage(video, 0, 0);
    var data = canvas.toDataURL();
    console.log(data);
    //    for(i=0;i<data.length-100000;i+=100000){
    //        //POST
    //        var xhr = getXMLHttpRequest();
    //        xhr.open("POST", "", true);
    //        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    //        xhr.send('data='+data.substring(i,i+100000));
    //        console.log('OK !!!');
    //    }
    //    var xhr = getXMLHttpRequest();
    //        xhr.open("POST", "", true);
    //        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    //        xhr.send('data='+data.substring(i,data.length)+'&fin=true');
    //        console.log('OK !!!');
    var xhr = getXMLHttpRequest();
        xhr.open("POST", "", true);
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xhr.send('data='+data+'&fin=true');
    console.log('FIN !!!');
}