//
// 29/08/2018
//
// Created by Marcos R.
// He who started with 0 knowledge of javascript
// and somehow managed to build something that works.
//
// Good luck refactoring.
//


//~~~~~ utility functions ~~~~~//

function printableTime(time){
	var hour = time_convert_to_hours(time);
	return ('0'+hour[0]).slice(-2)+':'+('0'+hour[1]).slice(-2);
}

function splitComma(text){
	return text.split(",");
}

function splitColon(text){
	return text.split(":");
}

function joinComma(array){
	return array.join(":");
}

function arrayLastElement(array) { 
	return array[array.length - 1]
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
	let year = d.getFullYear();
	return [day, month, year]
}

function mapTable(data){
	
	let arrayOfdata = splitComma(data);
	for (var i = arrayOfdata.length - 1; i >= 0; i--) {
		arrayOfdata[i] = splitColon(arrayOfdata[i]);
	}
	return arrayOfdata;
}

//~~ classes ~~//

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
	}

	isWorking(clocks) { 
		if (clocks.length%2 === 0) {
			return false;
		}
		else {
			return true;
		}
	}
	
	calculateHoursDone(clocks, isWorking){ 
		var hoursDone = 0;
		if(isWorking) {
			for (var i = 0; i < clocks.length-1; i += 2) {
				hoursDone += clocks[i+1] - clocks[i];
			}
			hoursDone += time_convert_to_minutes(getCurrentTime()) - arrayLastElement(clocks);
		}
		else {
			for (var i = 0; i < clocks.length; i += 2) {
				hoursDone += clocks[i+1] - clocks[i];
			}
		}
		return hoursDone;
	}
	

	calculateHoursLeft(hoursDone, workJourney){
		var hoursLeft = workJourney - hoursDone;
		if(hoursLeft < 0){
			this.extraHours=true;
		}
		return Math.abs(hoursLeft);
	}

	calculateLeaveTime(hoursLeft, isWorking) {
		var leaveTime;
		if(isWorking){
			leaveTime = hoursLeft + time_convert_to_minutes(getCurrentTime());
		}
		else {
			leaveTime = 0;
		}
		return leaveTime;
	}
}

// ~~~~~ main ~~~~~ //

function main(myJourney){

	var myBreak = 60;
	var currentDate = getCurrentDate().join('/');
	var data = $("td:contains('"+currentDate+"')").next().next().text();


	if(data.length>1){
		let timeTable = mapTable(data);
		var today = new WorkDay(timeTable);
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

chrome.storage.sync.get(['myJourney'], function(result) {
	console.log(Number(1*result.myJourney)); 
	myJourney = Number(1*result.myJourney); // 1* to turn str into int
	console.log("Ahgora extension running!");
	main(myJourney);
});

