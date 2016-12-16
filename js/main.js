// web audio api related stuff
var audio_context = new (window.AudioContext || window.webkitAudioContext)()
var on = false;
var paused = false;

// music related
var base_scale;

// timing related
var position = 0;

var startTime = audio_context.currentTime + 0.100;
var tempo = 150; // BPM (beats per minute)
var quarterNoteTime = 60 / tempo;

var bar_length = 24

var nextNoteTime = 0.0;
var scheduleAheadTime = 0.1;

var role_stack = [];

function generateSong() {
    if (paused && role_stack.length != 0) {
	return play();
    }
    base_scale = new Scale(randomRootNote(), randomScaleType());
    console.log("Scale: " + base_scale.root_note + " " + base_scale.type);
    setupInstruments(1);
    play();
}


function play() {
    // song hasn't been generated
    if (role_stack.length == 0) {
	return generateSong()
    }
    on = true
    setInterval(scheduler, 100);
}

function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 120 / tempo;	// picks up the CURRENT tempo value!
    nextNoteTime += 0.25 * secondsPerBeat;	// Add 1/4 of quarter-note beat length to time
    position++;
    if (position == bar_length) {
	position = 0;
    }
}

function scheduler() {
    if (!on)
	return
    while(nextNoteTime < audio_context.currentTime+ scheduleAheadTime){ // + scheduleAheadTime){
	playCursor();
	nextNote();
    }
}
    
function playCursor() {
    for (var role in role_stack) {
	role_stack[role].play(position);
    }
}

function pause() {
    on = false;
    paused = true;
    audio_context.currentTime = 0;
}

function reset() {
    role_stack = [];
    //on = false;
}

function setupInstruments(num_instruments) {
    for (var i = 0; i < num_instruments; i++) {
	var sequencer = new Sequence(bar_length, base_scale);
	var scale;
	if (i % 2 == 0) {
	    scale = new Scale(base_scale.root_note, base_scale.type);
	    scale.dropOctave()
	}
	else {
	    scale = base_scale;
	}
	var role = new Role(scale, sequencer, audio_context);
	role_stack.push(role);
    }
}
