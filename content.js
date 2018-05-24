//
console.log("Ahgora extension running!");

//~~~~~functions~~~~~//

function printableTime(time){
	return ('0'+time[0]).slice(-2)+':'+('0'+time[1]).slice(-2);
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

function addTime(t1, t2){ //t2+t1

	let result = [];
	result[0] = Number(t2[0]*1 + t1[0]*1); //str*1 transforms numeric string to number
	result[1] = Number(t2[1]*1 + t1[1]*1);
	
	if(result[1]>=60){
		result[0] += 1;
		result[1] -= 60;
	}

	return [result[0],result[1]];
}

function subTime(t1, t2){ //t2-t1

	let result = [];
	result[0] = Number(t2[0]*1 - t1[0]*1);
	result[1] = Number(t2[1]*1 - t1[1]*1);
	
	if(result[1]<0){
		result[0] -= 1;
		result[1] += 60;
	}

	return [result[0],result[1]];
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
	let month = ('0'+(d.getMonth()+1)).slice(-2); //nao sei porque +1... array index?
	return [day, month]
}

function getCurrentMonth(){
	let d = new Date();
	let month = ('0'+(d.getMonth()+1)).slice(-2); //nao sei porque +1... array index?
	let year = ('0'+d.getFullYear()).slice(-2);
	return [month, year]
}

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

class WorkDay {
	constructor(entry) {
		this.table=entry;
		this.entryTime=[];
		this.lastEntry=[];
		this.leaveTime=[];
		this.workJourney= [8,0];
		this.hoursLeft=[];
		this.hoursDone= [0,0];
		this.status= ""; // working, not working, extra-hours
		console.log(this.table[0][0]);
		console.log(this.table.length);
	}

	getEntryTime(){
		this.entryTime[0]  = Number(this.table[0][0]*1);
		this.entryTime[1]  = Number(this.table[0][1]*1);
	}
	
	calculateHoursDone(){
		if (this.table.length%2==0){
			this.status = "not working";
		}
		else {
			this.status = "working";
			this.lastEntry = this.table.pop();
		}
		for (var i = 0; i < this.table.length; i+=2) {
			this.hoursDone = addTime(this.hoursDone, subTime(this.table[i], this.table[i+1]));
		}
		if(this.status == "working"){
			this.hoursDone = addTime(this.hoursDone, subTime(this.lastEntry, getCurrentTime()));
		}
		//alert(this.hoursDone);
	}
	
	calculateHoursLeft(){
		this.hoursLeft = subTime(this.hoursDone, this.workJourney)
		//alert(this.hoursLeft);
		if(this.hoursLeft[0]<0){
			this.status="extra-hours";
		}
	}

	calculateLeaveTime() {
		if(this.status=="working"){
			this.leaveTime = addTime(getCurrentTime(), this.hoursLeft);
		}
		else {
			this.leaveTime = "--/--";
		}
		//alert(this.leaveTime);
	}

	calculateAllTimes() { //order matters
		this.getEntryTime();
		this.calculateHoursDone(this.table);
		this.calculateHoursLeft();
		this.calculateLeaveTime();
		
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

main();

function main(){
//insert elements
	let monthHeader = "<tr style='font-weight:bold'><td>Resumo do Mês</td><td class='text-right' id='month'></td></tr>";
	$("#tableTotalize").prepend(monthHeader);

	let insertion = "<table id='tableTotalize' class='table table-bordered table-striped'><tbody id='extensionInsertion'></tbody></table>";
	$(insertion).insertAfter("#tableTotalize");
	$("#extensionInsertion").html("<tr style='font-weight:bold'><td style='width:771px;height:25px'>Resumo do dia</td><td class='text-right' id='date' style='width:16%'></td></tr>");
	$("#extensionInsertion").append("<tr><td>Hora de entrada</td><td class='text-right' id='entry'></td>");
	$("#extensionInsertion").append("<tr><td>Horas trabalhadas</td><td class='text-right' id='done'></td>");
	$("#extensionInsertion").append("<tr><td>Horas faltantes</td><td class='text-right' id='left'></td>");
	$("#extensionInsertion").append("<tr style='font-weight:bold'><td>Hora de saida</td><td class='text-right' id='leave'></td>");

//populate table
	let currentDate = getCurrentDate().join('/');
	let currentMonth = getCurrentMonth().join('/');
	$("#date").html(currentDate);
	$("#month").html(currentMonth);
	let data = $("td:contains('"+currentDate+"')").next().next().text();
	let timeTable;
	console.log(1+"     23     ");
	if(data.length>1){
		timeTable = mapTable(data);
	}
	else{
		timeTable = data;
	}
	let today = new WorkDay(timeTable);
	today.calculateAllTimes();
	$("#entry").html(printableTime(today.entryTime));
	$("#done").html(printableTime(today.hoursDone));
	$("#left").html(printableTime(today.hoursLeft));
	$("#leave").html(printableTime(today.leaveTime));
}
