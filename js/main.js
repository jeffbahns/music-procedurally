
// web audio api related stuff
var context = new (window.AudioContext || window.webkitAudioContext)()
context.suspend(); 
var on = false;
var paused = false;
var instr_changed = true;;
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
    if (on) {
	return;
    }
    bar_length = randomInt(4, 32);
    generateTempo();
    generateSteps();
    base_scale = new Scale(randomRootNote(), randomScaleType());
    console.log("Scale: " + base_scale.root_note + " " + base_scale.type);
    setupInstruments(1);
    displayParameters();
    //play();
}


function play() {
    // song hasn't been generated
    if (role_stack.length == 0) {
	return generateSong()
    }

    context.resume();
    console.log("resumed");
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
    while(nextNoteTime < context.currentTime+ scheduleAheadTime){ // + scheduleAheadTime){
	playCursor();
	nextNote();
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
    nextNoteTime = 0;
    position = 0;
    context.close()
    context = new (window.AudioContext || window.webkitAudioContext)()
    context.suspend();
    instr_changed = true;
    generateSong();
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
	var role = new Role(scale, sequencer, context, new Instrument("bass-synth", context));
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
    var role = new Role(scale, sequencer, context, new Instrument("bass-synth", context));
    role_stack.push(role);
    
    //instrument 2 - lead type synth
    //var sequencer = new Sequence(bar_length, base_scale.size());
    var instrument = new Instrument("lead-synth", context, 300);
    var scale = new Scale(base_scale.root_note, base_scale.type);
    scale.dropOctave();
    var role = new Role(scale, sequencer, context, instrument);
    role_stack.push(role);
    
    //instrument 3
    //instrument 1 - bass type synth
    var sequencer = new Sequence(bar_length, base_scale.size()+5);
    var instrument = new Instrument("synth", context, 300);
    var scale = new Scale(base_scale.root_note, base_scale.type);
    scale.dropOctave();
    scale.dropOctave();
    scale.dropOctave();
    var role = new Role(scale, sequencer, context, new Instrument("mid-synth", context));
    role_stack.push(role);
    
}

function createDrums() {
    // kick drum
    var sequencer = new Sequence(bar_length, 3);
    var role = new Role(base_scale, sequencer, context, new Instrument("kick", context));
    role_stack.push(role);
    
    // snare
    var sequencer = new Sequence(bar_length, 2);//4
    var role = new Role(base_scale, sequencer, context, new Instrument("snare", context));
    role_stack.push(role);
}

function generateTempo() {
    tempo = randomInt(40, 180);
    redisplay = true;
}
function generateSteps() {
    bar_length = randomInt(2, 24);
    redisplay = true;
}

function regenerateSequence(index) {
    role_stack[index].regenerateSequence();
}

function regenerateStepsAll() {
    // regen bars
    generateSteps();
    role_stack.forEach(function(role) {
	role.sequence.bar_length = bar_length;
	role.regenerateSequence();
    });
    position = 0;
}

function regenerateInstrument(index) {
    // regenerates an instrument only
    console.log
    role_stack[index].regenerateInstrument();
}

function muteRole(index) {
    var button = '#mute-' + index + '';
    console.log(button);
    if (role_stack[index].mute == true) {
	$(button).innerHTML = "mute";
    }
    else {
	$(button).innerHTML = "unmute";
    }
    role_stack[index].mutes();
    instr_changed = true;
}

function displayParameters() {    $('#details').empty();
    
    
    $('#details').append('<div><b>Root Note:</b> ' + base_scale.root_note + '</br>');
    $('#details').append('<div><b>Scale:</b> ' + base_scale.type + '</br>');

    var display_pos = position +1;
        $('#details').append('<button type="button" onClick="regenerateStepsAll()" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-retweet"></span></button>');
    $('#details').append('<b>Steps:</b> ' + display_pos + '/' + bar_length + '</br>');


    $('#details').append('<button type="button" onClick="generateTempo()" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-retweet"></span></button>');
    $('#details').append('<b>Tempo (BPM):</b> ' + tempo + '  ' + '</br>');


    if (instr_changed) {
	$('#instruments').empty();
	for (var i = 0; i < role_stack.length; i++) {
	    $('#instruments').append(role_stack[i].display());
	    $('#instruments').append('</br><button type="button" onClick="regenerateInstrument(' + i + ')" class="btn btn-xs btn-default">Instrument <span class="glyphicon glyphicon-retweet"></span></button>');
	    $('#instruments').append('</br><button type="button" onClick="regenerateSequence(' + i + ')" class="btn btn-xs btn-default">Sequence <span class="glyphicon glyphicon-retweet"></span></button>');
	    var mute_display;
	    if (role_stack[i].mute == true)
		mute_display = "Unmute";
	    else
		mute_display = "Mute";
	    $('#instruments').append('<button type="button" value="' + role_stack[i].mute + '" id="mute-' + i + '"onClick="muteRole(' + i + ')" class="btn btn-xs btn-default">' + mute_display + '</button></br></br>');

	    /*
	    if(role_stack[i].mute)
		$('#mute' + role_stack[i].type  + '').prop('checked', false);
	    else
		$('#mute' + role_stack[i].type + '').prop('checked', true);

	    $('#' + role_stack[i].type + '').click(function(){
		muteRole(i);
	    })
	    */
	}
	

	instr_changed = false;
    }

    redisplay = false;
}
