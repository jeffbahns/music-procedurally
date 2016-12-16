
// web audio api related stuff
var context = new (window.AudioContext || window.webkitAudioContext)()
context.suspend(); 
var on = false;
var paused = false;

// front end related
redisplay = false;

// music related
var base_scale;
var role_stack = [];

// timing related
var position = 0;
var startTime = context.currentTime + 0.100;
var tempo = 100; // BPM
var quarterNoteTime = 60 / tempo;
var bar_length = 8;
var nextNoteTime = 0.0;
var scheduleAheadTime = 0.1;

$(document).ready(function () {
    generateSong();
});

function generateSong() {
    if (paused && role_stack.length != 0) {
	return play();
    }
    bar_length = randomInt(4, 32);
    generateTempo();
    generateSteps();
    base_scale = new Scale(randomRootNote(), randomScaleType());
    console.log("Scale: " + base_scale.root_note + " " + base_scale.type);
    setupInstruments(1);
    displayParameters();
    play();
}


function play() {
    // song hasn't been generated
    if (role_stack.length == 0) {
	return generateSong()
    }
    context.resume();
    on = true
    setInterval(scheduler, 100);
}
vv
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

    while(nextNoteTime < context.currentTime+ scheduleAheadTime){ // + scheduleAheadTime){
	playCursor();
	nextNote();
	//if (redisplay)
	    displayParameters();
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
    context.suspend();
}

function reset() {
    role_stack = [];
    on = false;
    position = 0;
    context.suspend();
}

function setupInstruments(num_instruments) {
    return setupInstruments2()
    createDrums();
    for (var i = 0; i < num_instruments; i++) {
	var sequencer = new Sequence(bar_length, base_scale.size());
	var scale;
	if (i % 2 == 0) {
	    scale = new Scale(base_scale.root_note, base_scale.type);
	    scale.dropOctave();
	    scale.dropOctave();
	    scale.dropOctave();
	    scale.dropOctave();
	}
	else {
	    scale = base_scale;
	}
	var role = new Role(scale, sequencer, context, new Instrument("synth", context));
	role_stack.push(role);
    }

}

function setupInstruments2() {
    //drums
    createDrums();

    //instrument 1 - bass type synth
    var sequencer = new Sequence(bar_length, base_scale.size());
    var instrument = new Instrument("synth", context, 300);
    var scale = new Scale(base_scale.root_note, base_scale.type);
    scale.dropOctave();
    scale.dropOctave();
    scale.dropOctave();
    scale.dropOctave();
    var role = new Role(scale, sequencer, context, new Instrument("synth", context));
    role_stack.push(role);
    
    //instrument 2 - lead type synth
    var sequencer = new Sequence(bar_length, base_scale.size());
    var instrument = new Instrument("synth", context, 300);
    var scale = new Scale(base_scale.root_note, base_scale.type);
    scale.dropOctave();
    var role = new Role(scale, sequencer, context, instrument);
    role_stack.push(role);
    
    //instrument 3
    //instrument 1 - bass type synth
    var sequencer = new Sequence(bar_length, base_scale.size());
    var instrument = new Instrument("synth", context, 300);
    var scale = new Scale(base_scale.root_note, base_scale.type);
    scale.dropOctave();
    scale.dropOctave();
    scale.dropOctave();
    var role = new Role(scale, sequencer, context, new Instrument("synth", context));
    //role_stack.push(role);
    
}

function createDrums() {
    // kick drum
    var sequencer = new Sequence(bar_length, 3);
    var role = new Role(base_scale, sequencer, context, new Instrument("kick", context));
    role_stack.push(role);
    
    // snare
    var sequencer = new Sequence(bar_length, 4);
    var role = new Role(base_scale, sequencer, context, new Instrument("snare", context));
    role_stack.push(role);
}

function generateTempo() {
    tempo = randomInt(40, 160);
    redisplay = true;
}
function generateSteps() {
    bar_length = randomInt(2, 32);
    redisplay = true;
}
function displayParameters() {
    $('#details').empty();
    $('#instruments').empty();
    
    $('#details').append('<div><b>Root Note:</b> ' + base_scale.root_note + '</br>');
    $('#details').append('<div><b>Scale:</b> ' + base_scale.type + '</br>');

    var display_pos = position +1;
    $('#details').append('<b>Steps:</b> ' + display_pos + '/' + bar_length + '</br>');


    $('#details').append('<b>Tempo (BPM):</b> ' + tempo + '  ');
        $('#details').append('<button type="button" onClick=generateTempo() class="btn btn-xs btn-default"><span class="glyphicon glyphicon-retweet"></span></button><button<span class="glyphicon glyphicons-retweet"></span></br>');

    role_stack.forEach(function(role) {
	$('#instruments').append(role.display());
    })
    redisplay = false;
}
