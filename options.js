function load_options() {
	chrome.storage.sync.get(["myJourney"], function(items) {
    	document.getElementById('journey').value = items.myJourney;
  	});
}

function save_options() {
	var journey = document.getElementById('journey').value;
	chrome.storage.sync.set({
	myJourney: journey
	}, function() {
	// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved!';
		setTimeout(function() {
	  		status.textContent = '';
			}, 1500);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		myJourney: undefined
  	}, function(items) {
    	document.getElementById('journey').value = items.myJourney;
  	});
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('save').addEventListener('click', save_options);
  document.getElementById('restore').addEventListener('click', restore_options);
  load_options();
});