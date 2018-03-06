// SETUP FONT AND TEXT
var font;
var backgroundColor;

function preload() {
  var fonts = ['./fonts/VeraBd.ttf','./fonts/luxirri.ttf'];
  luxirri = loadFont('./fonts/luxirri.ttf');
  font = loadFont('./fonts/VeraBd.ttf');
  comicate = loadFont('./fonts/COMICATE.ttf');
  luxirb =   loadFont('./fonts/luxirb.ttf');
}

function chooseFont() {

}

// COLOR

// TEXT
var inp;
var myText = "You can type too";
var points;
var inputPlaceholder = "You can write, too";

// PLAYER
var playerContainer, player, preview;
var myPreview = document.getElementById("myPreview");

// SPEECH REC
var speechLanguage = 'FR-fr';
var myRec = new p5.SpeechRec(speechLanguage,parseSpeechResults); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true; // allow partial recognition (faster, less accurate)

function parseSpeechResults() {
  spokenWords = myRec.resultString;
}

// SETUP VIDEO RECORDING
var capturer = new CCapture( {
  format: 'webm',
  name:'preview'
 }
);

// SETUP SOUND RECORDING
var mic, recorder, soundFile;
var state = 0;
var recordButton;


function setup() {

  // Canvas
  myCanvas = createCanvas(windowWidth,windowHeight);
  myCanvas.id('myCanvas');
  myCanvas.parent('canvas-container');

  backgroundColor = color(random(255),random(255),random(255));

  // POINTS

  // PLAYER
  player = createDiv('')
  player.id('playerContainer');
  player.position(10, windowHeight - 270);
  player.hide('');

  // Controls
  recordButton = createDiv('HOLD TO RECORD');
  recordButton.id('record-button');
  recordButton.position(windowWidth / 2, windowHeight - 150);
  recordButton.mouseClicked(audioRecording);
  recordButton.hide();

  // Input
  inp = createInput(myText);
  inp.input(myInputEvent);
  inp.elt.focus();
  inp.id('myInput');
  inp.elt.focus();
  // inp.attribute('maxlength','15');
  // inp.hide();

  // create an audio in
  mic = new p5.AudioIn();
  // prompts user to enable their browser mic
  mic.start();
  // create a sound recorder
  recorder = new p5.SoundRecorder();
  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();
  fft = new p5.FFT();

  myRec.start();

  // By default, it does not .connect() (to the computer speakers)

}

var h, vol, strokeImpact, mappedVol, spectrum, myCentroid;
var spokenWords;

// PROCESS SOUND DATA

function processSoundData() {
  // Get and map volume
  vol = mic.getLevel();
  mappedVol = map(vol, 0, 1, 0, 40);

  // Get spectrum
  spectrum = fft.analyze();
  for (i = 0; i < spectrum.length; i++) {
    var mappedSpectrum = map(spectrum[i], 0, spectrum.length, 0,255);
    console.log(mappedSpectrum[i]);
  }
  // Get speech

}

// DRAW TEXT

var shapes = ['POINTS', 'LINES', 'TRIANGLES', 'TRIANGLE_FAN', 'TRIANGLE_STRIP', 'QUADS', 'QUAD_STRIP'];
var randomShape, randomColor;
var textBlueColor;

function drawText() {
  if (myRec.resultValue) {
    parseSpeechResults();
    points = font.textToPoints(spokenWords.toUpperCase(),120,windowHeight/2,150 + mappedVol * 5 );
  }
  else {
    points = font.textToPoints("TALK TO YOUR SCREEN",100,windowHeight/2,80 + mappedVol * 5 );
  }
  beginShape();
  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    // colorText();
    sinColor = color(((sin(millis()/1000)+ 1)/2)*255, ((sin(millis()/2000)+ 1)/2)*255, ((sin(millis()/1500)+ 1)/2)*255);
    stroke(sinColor);
    strokeWeight(3 + mappedVol/10);
    vertex(pt.x, pt.y);
    fill(backgroundColor);
  }
  randomColor = color(random(255),random(255),random(255));
  endShape();
}

var inputText;
function drawTextFromInput(){
  textFont(font);
  text(myText, 50,50,windowWidth-100,windowHeight-100);
  textSize(42);
}

var myCanvas;

function render(){
	requestAnimationFrame(render);
	// rendering stuff ...
	capturer.capture(document.getElementById('myCanvas'));
}

function draw() {
  backgroundColor.setRed(128 + 128 * sin(millis() / 5000));
  background(backgroundColor);
  processSoundData();
  drawText();
  drawTextFromInput();
  noStroke();
  inp.elt.focus();
}

function showPreview() {
  capturer.save( function( blob ) { /* ... */ } );
  preview = createVideo('preview.webm',vidLoad);
  preview.parent('playerContainer');
  player.show();
}

function vidLoad() {
  preview.play();
}

function audioRecording() {
  // make sure user enabled the mic
  if (state === 0 && mic.enabled) {

    // record to our p5.SoundFile
    // recorder.record(soundFile);

    // Video Capture
    // capturer.start();
    // render();

    recordButton.html("RECORDING");
    state++;
  }
  else if (state === 1) {
    background(0,255,0);

    // stop recorder and
    // send result to soundFile
    // capturer.stop();

    // capturer.save();

    // recorder.stop();
    // showPreview();
    recordButton.html("PLAYING...");

    // soundFile.play(); // play the result!
    recordButton.html("DOWNLOAD");
    state++;
  }

  else if (state === 2) {

    // save(soundFile, 'mySound.wav');
    // save video


    recordButton.html("PRESS<br>TO<br>RECORD");
    state = 0;
  }
}

function mouseClicked() {

}

function myInputEvent() {
  myText = this.value();
}
