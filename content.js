//
console.log("Ahgora extension running!");

//myJourney = 480;
var myBreak = 60;

//~~~~~functions~~~~~//

function printableTime(time){
	var hour = time_convert_to_hours(time);
	return ('0'+hour[0]).slice(-2)+':'+('0'+hour[1]).slice(-2);
}

function arrayLastElement(array) { //done
	return array[array.length - 1]
}


function calculateJourney(data){
	let timeTable= mapTable(data);
	let today = new WorkDay(timeTable[0]);
	today.calculateAllTimes(timeTable);
	//clearResults();
	//printStatus(today);
	//printAllResults(today);
	return today;
}

//~~ functions below ~~//

function splitComma(text){
	return text.split(",");
}

function splitColon(text){
	return text.split(":");
}
function joinComma(array){
	return array.join(":");
}

function mapTable(data){
	
	let arrayOfdata = splitComma(data);
	for (var i = arrayOfdata.length - 1; i >= 0; i--) {
		arrayOfdata[i] = splitColon(arrayOfdata[i]);
	}
	return arrayOfdata;
}

function time_convert_to_minutes(time) {
	return time[0]*60 + time[1]*1; //*1 converts str to int
}

function time_convert_to_hours(time) {
	var minutes = time % 60;
	var hours = (time - minutes) / 60;
	return [hours,minutes];
}

function time_convert_array_to_minutes(array) {
	for (var i = 0; i < array.length; i++) {
		array[i] = time_convert_to_minutes(array[i]);
	}
	return array;
}

function time_convert_array_to_hours(array) {
	for (var i = 0; i < array.length; i++) {
		array[i] = time_convert_to_hours(array[i]);
	}
	return array;
}



// function addTime(t1, t2){ //t2+t1

// 	let result = [];
// 	result[0] = Number(t2[0]*1 + t1[0]*1); //str*1 transforms numeric string to number
// 	result[1] = Number(t2[1]*1 + t1[1]*1);
	
// 	if(result[1]>=60){
// 		result[0] += 1;
// 		result[1] -= 60;
// 	}

// 	return [result[0],result[1]];
// }

// function subTime(t1, t2){ //t2-t1

// 	let result = [];
// 	result[0] = Number(t2[0]*1 - t1[0]*1);
// 	result[1] = Number(t2[1]*1 - t1[1]*1);
	
// 	if(result[1]<0){
// 		result[0] -= 1;
// 		result[1] += 60;
// 	}

// 	return [result[0],result[1]];
// }

function getCurrentTime(){
	let d = new Date();
	let hour = ('0'+d.getHours()).slice(-2);
	let minute = ('0'+d.getMinutes()).slice(-2);
	return [hour, minute]
}

function getCurrentDate(){
	let d = new Date();
	let day = ('0'+d.getDate()).slice(-2);
	let month = ('0'+(d.getMonth()+1)).slice(-2); // +1 because month array is indexed at 0 (jan === 0)
	//let year = ('0'+d.getFullYear()).slice(-2);
	let year = d.getFullYear();
	return [day, month, year]
}

// function getCurrentMonth(){
// 	let d = new Date();
// 	let month = ('0'+(d.getMonth()+1)).slice(-2); //nao sei porque +1... array index?
//	let year = ('0'+d.getFullYear()).slice(-2);
// 	return [month, year]
// }

function printResults(string) {
	document.getElementById('results').innerHTML += "<p>"+string+"</p>";
}

function printStatus(obj){
	if(obj.status=="extra-hours"){
		document.getElementById('results').innerHTML += "<h4> EXTRA HOURS! </h4>";
	}
	else if(obj.status=="working"){
		document.getElementById('results').innerHTML += "<h4> Working </h4>";
	}
	else{
		document.getElementById('results').innerHTML += "<h4> Off duty </h4>";
	}
}

function printAllResults(obj){

	printResults(obj.stringHoursDone());
	printResults(obj.stringHoursLeft());
	if(obj.status=="working"){
		printResults(obj.stringLeaveTime());
	}
}

function clearResults(){
	document.getElementById('results').innerHTML = "";
}

//~~ classes ~~//

// class Status {
// 	var _label = {
// 		0: "No show",
// 		1: "Working",
// 		2: "Break",
// 		3: "Working",
// 		4: "Done"
// 	}

// 	constructor(status) {
// 		this.id = status
// 		this.name = _label(status)
// 	}
// }

class WorkDay {

	constructor(readings) {
		this.workJourney = myJourney;
		this.breakDone = false;
		this.extraHours = false;
		this.minBreak = myBreak;

		this.clocks = time_convert_array_to_minutes(readings);
		this.entryTime = this.clocks[0];
		this.isWorking = this.isWorking(this.clocks);
		this.hoursDone = this.calculateHoursDone(this.clocks, this.isWorking);
		this.hoursLeft = this.calculateHoursLeft(this.hoursDone, this.workJourney);
		this.leaveTime = this.calculateLeaveTime(this.hoursLeft, this.isWorking);
		//this.status = this.getStatus(this.clocks) ; // working, not working, extra-hours
	}

	// getEntryTime(entry){ // necessary?
	// 	let entryTime = [];
	// 	entryTime[0]  = Number(entry[0]*1);
	// 	entryTime[1]  = Number(entry[1]*1);
	// 	return entryTime;
	// }

	isWorking(clocks) { //Done
		if (clocks.length%2 === 0) {
			return false;
		}
		else {
			return true;
		}
	}

	// getStatus(clocks) { //done
	// 	if(isWorking(clocks)) {
	// 		status = {"id": 1, "name": "Working"};
	// 	}
	// 	else {
	// 		status = {"id": 0, "name": "Not working"};
	// 	}
	// 	return status;
	// }
	
	calculateHoursDone(clocks, isWorking){ //done
		var hoursDone = 0;
		if(isWorking) {
			for (var i = 0; i < clocks.length-1; i += 2) {
				//hoursDone = addTime(hoursDone, subTime(clocks[i], clocks[i+1]));
				hoursDone += clocks[i+1] - clocks[i];
			}
			//hoursDone = addTime(hoursDone, subTime(arrayLastElement(clocks), getCurrentTime()));
			hoursDone += time_convert_to_minutes(getCurrentTime()) - arrayLastElement(clocks);
		}
		else {
			for (var i = 0; i < clocks.length; i += 2) {
				//hoursDone = addTime(hoursDone, subTime(clocks[i], clocks[i+1]));
				hoursDone += clocks[i+1] - clocks[i];
			}
		}
		return hoursDone;
	}
	

	calculateHoursLeft(hoursDone, workJourney){ //Done
		//var hoursLeft = subTime(hoursDone, workJourney)
		var hoursLeft = workJourney - hoursDone;
		if(hoursLeft < 0){
			this.extraHours=true;
		}
		return Math.abs(hoursLeft);
	}

	calculateLeaveTime(hoursLeft, isWorking) { //Done
		var leaveTime;
		if(isWorking){
			//leaveTime = addTime(getCurrentTime(), hoursLeft);
			leaveTime = hoursLeft + time_convert_to_minutes(getCurrentTime());
		}
		else {
			leaveTime = 0;
		}
		return leaveTime;
	}

	stringHoursDone(){
		return "Horas trabalhadas: " + this.hoursDone[0] + " horas e " + this.hoursDone[1] + " minutos.";
	}
	stringEntryTime(){
		return "Hora da entrada: " + this.entryTime[0] + " horas e " + this.entryTime[1] + "minutos.";
	}
	stringLeaveTime(){
		return "Hora da saida: " + this.leaveTime[0] + " horas e " + this.leaveTime[1] + "minutos.";
	}
	stringHoursLeft(){
		let string = "Faltam: " + this.hoursLeft[0] + " horas e " + this.hoursLeft[1];
		if(this.status=="working"){
			string += " minutos para ir embora.";
		}
		else{
			string += " minutos a pagar.";
		}
		return string;
	}
}


class Insert {

	constructor(title, id, html) {
		this.title = title;
		this.id = id;
		this.html = html;
	}

}

chrome.storage.sync.get(['myJourney'], function(result) {
	console.log(Number(1*result.myJourney));
	myJourney = Number(1*result.myJourney);
	main(myJourney);
});
//main();

function main(myJourney){
//insert elements

//populate table
	let currentDate = getCurrentDate().join('/');
	//let currentMonth = getCurrentMonth().join('/');
	
	//$("#month").html(currentMonth);
	let data = $("td:contains('"+currentDate+"')").next().next().text();
	//data = '11:45, 15:44, 16:29'; // short working
	//data = '11:45, 15:44, 16:29, 20:17'; // short left
	//data = '11:45, 15:44, 16:29, 20:17'; // just right
	//data = '08:30'; // extra working
	//data = '09:45, 15:44, 16:29, 20:17'; // extra left
	
	let timeTable;
	if(data.length>1){
		timeTable = mapTable(data);
		let today = new WorkDay(timeTable);
				
		let monthHeader = "<tr style='font-weight:bold'><td>Resumo do Mês</td><td class='text-right' id='month'></td></tr>";
		$("#tableTotalize").prepend(monthHeader);

		let insertion = "<table id='tableTotalize' class='table table-bordered table-striped'><tbody id='extensionInsertion'></tbody></table>";
		$(insertion).insertAfter("#tableTotalize");
		$("#extensionInsertion").html("<tr style='font-weight:bold'><td style='width:771px;height:25px'>Resumo do dia</td><td class='text-right' id='date' style='width:15.25%'></td></tr>");
		$("#extensionInsertion").append("<tr><td>Hora de entrada</td><td class='text-right' id='entry'></td>");
		$("#extensionInsertion").append("<tr><td>Horas trabalhadas</td><td class='text-right' id='done'></td>");
		$("#date").html(currentDate);
		$("#entry").html(printableTime(today.entryTime));
		$("#done").html(printableTime(today.hoursDone));
		if(today.extraHours){
			$("#extensionInsertion").append("<tr><td>HORA EXTRA! </td><td class='text-right' id='extra'></td>");
			$("#extra").html(printableTime(today.hoursLeft));
		}
		else{
			$("#extensionInsertion").append("<tr><td>Horas faltantes</td><td class='text-right' id='left'></td>");
			$("#extensionInsertion").append("<tr style='font-weight:bold'><td>Hora de saida</td><td class='text-right' id='leave'></td>");
			$("#left").html(printableTime(today.hoursLeft));
			$("#leave").html(printableTime(today.leaveTime));
		}
	}
	else{
		console.log('DATA NOT FOUND');
		let data_not_found = "<h4>CURRENT DAY DATA NOT FOUND<h4><h5>Está no mês correto?<h5>";
		$(data_not_found).insertAfter("#tableTotalize");
	}
}
