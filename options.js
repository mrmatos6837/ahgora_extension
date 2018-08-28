var defaultJourney = 480;
var defaultBreak = 60;

function load_options() {
	chrome.storage.sync.get(["myJourney"], function(items) {
    	document.getElementById('journey').value = items.myJourney;
  	});
}

function options() {
	var myJourney = localStorage["myJourney"];

	// valid colors are red, blue, green and yellow
	if (myJourney == undefined || (myJourney != '480' && myJourney != '360' && myJourney != '240')) {
		myJourney = defaultJourney;
	}
	var select = document.getElementById("journey");
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
			if (child.value === myJourney) {
			child.selected = "true";
			break;
		}
	}
}

function save_options() {
	var journey = document.getElementById('journey').value;
	chrome.storage.sync.set({
	myJourney: journey
	}, function() {
	// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
	  		status.textContent = '';
			}, 750);
	});
}
function restore_options() {
	chrome.storage.sync.get({
		myJourney: 480
  	}, function(items) {
    	document.getElementById('journey').value = items.myJourney;
  	});
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('save').addEventListener('click', save_options);
  document.getElementById('restore').addEventListener('click', restore_options);
  load_options();
});