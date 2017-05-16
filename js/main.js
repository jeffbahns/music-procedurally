
// web audio api/control related stuff
var context = new (window.AudioContext || window.webkitAudioContext)()
context.suspend();

var on = false;
var paused = false;
var instr_changed = true;

// front end related
redisplay = false;

// music related
var base_scale;
var role_stack = [];

// timing related
var position = 0;
var startTime = context.currentTime + 0.100;
var tempo; // BPM
var quarterNoteTime = 60 / tempo;
var bar_length = 8;
var nextNoteTime = 0.0;
var scheduleAheadTime = 0.1;

var test_instr = new Instrument("leadsynth", context, 300);
test_instr.preset(0);

// model variables
var m;
var seed;
var rows;
var cols;
var root;
var scale_type;
var scale;

var dope_seeds = [
    12390121,
    606060,
    909090
]

$(document).ready(function () {
    // add scale and root notes to front end select boxes
    $('#scale_type').append("<option value=\"random\">Random (default)</option>");
    for (var i = 0; i < Object.keys(scales).length; i++) {
	$('#scale_type').append("<option value=\"" + Object.keys(scales)[i] + "\">" + Object.keys(scales)[i] +  "</option>");
    }
    $('#scale_root').append("<option value=\"random\">Random (default)</option>");
    for (var i = 0; i < Object.keys(notes).length; i++) {
	$('#scale_root').append("<option value=\"" + Object.keys(notes)[i] + "\">" + Object.keys(notes)[i] +  "</option>");
    }
    new_shit();

});

function new_shit() {
    console.log("seed?:", binaryToInt(randomSeed(512)));
    
    $('#grid').empty();
    //seed = document.getElementById("seed").value;
    rows = document.getElementById("rows").value;
    cols = document.getElementById("columns").value;
    scale_type = document.getElementById("scale_type").value;
    root = document.getElementById("scale_root").value;
    tempo = document.getElementById("tempo").value;
    console.log(scale_type, root);
    if (scale_type == "random" ) {
	if (root == "random") {
	    console.log("making random scale");
	    scale = randomScale(rows);
	} else {
	    console.log("making scale with random type but root of", root);
	    scale = new Scale(root, randomScaleType(), rows);
	}
    } else if (root == "random") {
	console.log("making scale with random root but type of", scale_type);
	scale = new Scale(randomRootNote(), scale_type, rows);
    } else {
	console.log(root, scale_type, "hellyeah");
	scale = new Scale(root, scale_type, rows);
    }
    //scale = Scale('A', 'chromatic', rows);
    console.log(scale.root_note, "is root", scale.type, "is type");
    
    m = new Model(context, seed, scale, rows, cols);
    console.log(m.scale());
    console.log(m.getSeed());
    d3.selectAll('.square').on("click", function(d){
        m.addSquare(d);
    });
    display();
}

function generateSong() {
    if (paused && role_stack.length != 0) {
        return play();
    }
    if (on) {
        return;
    }
    setupParameters();
    displayParameters();
}

function setupParameters() {
    bar_length = randomInt(4, 32);
    generateTempo();
    generateSteps();
    base_scale = randomScale();
    setupInstruments(1);
}

function play() {
    // song hasn't been generated
    //if (role_stack.length == 0) {
    //return generateSong()
//}
    context.resume();
    on = true
    setInterval(scheduler, 100);
}

function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 120 / tempo; // picks up the CURRENT tempo value!
    nextNoteTime += .25 * secondsPerBeat; // Add 1/4 of quarter-note beat length to time
    position++;
    if (position == bar_length) {
        position = 0;
    }
}

function scheduler() {
    if (!on)
	return ;
    while (nextNoteTime < context.currentTime + scheduleAheadTime){ // + scheduleAheadTime){
	m.play();
	nextNote();
	display();
    }
}

// pause scheduler
function pause() {
    on = false;
    paused = true;
    context.suspend();
}

// reset all variables, instruments, generate new song
function reset() {
    role_stack = [];
    on = false;
    nextNoteTime = 0;
    position = 0;
    context.close()
    context = new(window.AudioContext || window.webkitAudioContext)()
    context.suspend();
    instr_changed = true;
    generateSong();
}

// generates a tempo/pace for the music
function generateTempo() {
    tempo = randomInt(40, 180);
    redisplay = true;
}

//
function generateSteps() {
    bar_length = randomInt(2, 24);
    redisplay = true;
}

// regenerates the sequence/music for any instrument
function regenerateSequence(index) {
    role_stack[index].regenerateSequence();
}

// regenerate the sequence/music for all instruments on the scheduler
function regenerateStepsAll() {
    // regen bars
    generateSteps();
    role_stack.forEach(function(role) {
        role.sequence.bar_length = bar_length;
        role.regenerateSequence();
    });
    position = 0;
}

// create new instrument sound at index
function regenerateInstrument(index) {
    // regenerates an instrument only
    console.log
    role_stack[index].regenerateInstrument();
}

// mute instrument
function muteRole(index) {
    var button = '#mute-' + index + '';
    console.log(button);
    if (role_stack[index].mute == true) {
        $(button).innerHTML = "mute";
    } else {
        $(button).innerHTML = "unmute";
    }
    role_stack[index].mutes();
    instr_changed = true;
}

function display() {
    $('#details').empty();
    
    $('#details').append('<div><b>Root Note:</b> ' + m.root_note() + '</br>');
    $('#details').append('<div><b>Scale:</b> ' + m.scale_type() + '</br>');
    $('#details').append('<div><b>Tempo:</b> ' + tempo + '</br>');
    $('#details').append('<div><b>Seed:</b> ' + m.getSeed() + '</br>');

}

function displayParameters() {
    $('#details').empty();
    $('#details').append('<div><b>Root Note:</b> ' + base_scale.root_note + '</br>');
    $('#details').append('<div><b>Scale:</b> ' + base_scale.type + '</br>');

    var display_pos = position + 1;
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
        }


        instr_changed = false;
    }

    redisplay = false;
}
