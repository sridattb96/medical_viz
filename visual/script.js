
$(document).ready(function(){

	var lineWidth = 1200;
	var xOffset = 50;
	var rowHeight = 50;

	var minDate = "12/12/2222";
	var maxDate = "1/1/1990";

	function getDateDiff(date1, date2){
		date1 = date1.split("/")
		date2 = date2.split("/")
		var oneDay = 24*60*60*1000; 
		var d1 = new Date(date1[2],date1[0],date1[1]);
		var d2 = new Date(date2[2],date2[0],date2[1]);

		return Math.round(Math.abs((d1.getTime() - d2.getTime())/(oneDay)));
	}

	function compareTime(time1, time2) {
	    return new Date(time1) > new Date(time2); // true if time1 is later
	}

	function getDateRange(enrollment_data){

		for (var i = 0; i < enrollment_data.length; i++){
			var admit_date = enrollment_data[i]["Admit Date"];
			if (compareTime(minDate, admit_date)) minDate = admit_date;
			else if (compareTime(admit_date, maxDate)) maxDate = admit_date;
		}

		return getDateDiff(minDate, maxDate);
	}

	function drawDrugs(svgContainer, pid, patients, dateRange){
		if (!(pid in patients)) return

		if (!("drugs" in patients[pid])) return

		var drugObj = {
			"Vancomycin": "#14d2d5",
			"Other": "#1d7ab7",
			"Linezolid": "#f47f30"
		}

		var drugArr = patients[pid]["drugs"];
		var numDrugs = drugArr.length;

		for (var i = 0; i < numDrugs; i++){
			var diff = getDateDiff(minDate, drugArr[i]["startDate"]);
			var x = xOffset + (lineWidth-xOffset)*diff/dateRange;
			var width = (lineWidth-xOffset)*drugArr[i]["duration"]/dateRange;
			var height = 20;
			var y = (rowHeight - height)/2
			var rectangle = svgContainer.append("rect")
										.attr("x", x)
										.attr("y", y)
										.attr("width", width)
										.attr("height", height)
										.style("fill", drugObj[drugArr[i]["name"]])
										.style("opacity", ".5");
		}
	}

	function drawProcedures(svgContainer, pid, patients, dateRange){
		if (!(pid in patients)) return

		if (!("procedures" in patients[pid])) return

		var colorObj = {
			"Excision": "#9b093e",
			"Skin Graft": "#4a4e7b",
			"Other": "#000000",
			"Amputation": "#c0e3c0",
			"Arterial Line - New": "#00dfc3",
			"Central Line - New": "#e20800",
			"Arterial Line - REWIRE": "#4d91e2",
			"Central Line - REWIRE": "#a0a9ba"
		}

		var numProcedures = patients[pid]["dates"].length;

		for (var i = 0; i < numProcedures; i++) {
			var diff = getDateDiff(minDate, patients[pid]["dates"][i])
			var cx = xOffset + (lineWidth-xOffset)*diff/dateRange;
			var cy = rowHeight/2;
			var proc = patients[pid]["procedures"][i].split(',');
			for (var j = 0; j < proc.length; j++){
				var c = svgContainer.append("circle")
									.attr("cx", cx)
									.attr("cy", cy)
									.attr("r", 4)
									.style("fill", colorObj[proc[j]]);
				cy += 10;
			}
		}
	}
	
	d3.csv("../data/antimicrobial.csv", function(antimicrobial_data) {
		d3.csv("../data/enrollment.csv", function(enrollment_data) {
			d3.csv("../data/procedures.csv", function(procedures_data) {

				patients = {} // object containing procedure information
				for (var i = 0; i < procedures_data.length; i++){
					var pid = procedures_data[i]["Pt ID"];
					var date = procedures_data[i]["Procedure Date"];
					var procedures = procedures_data[i]["Procedures"].replace(/[\[\]]+/g, '');

					if (!(pid in patients)){
						patients[pid] = {};
						patients[pid]["dates"] = []
						patients[pid]["procedures"] = []
					}

					patients[pid]["dates"].push(date)
					patients[pid]["procedures"].push(procedures)
				}

				for (var i = 0; i < antimicrobial_data.length; i++){
					var pid = antimicrobial_data[i]["Pt ID"];
					var startDate = antimicrobial_data[i]["Start Date"];
					var endDate = antimicrobial_data[i]["Stop Date"];
					var drug = antimicrobial_data[i]["Drug"];

					if (!(pid in patients)){
						patients[pid] = {};
						patients[pid]["drugs"] = [];
					}

					if (!("drugs" in patients[pid])) patients[pid]["drugs"] = []

					patients[pid]["drugs"].push({
						"name": drug,
						"startDate": startDate,
						"duration": getDateDiff(startDate, endDate)
					});
				}

				console.log(patients)

				var dateRange = getDateRange(enrollment_data);
				for (var i = 0; i < enrollment_data.length; i++){
					var pid = enrollment_data[i]["Pt Id"];
					var admit_date = enrollment_data[i]["Admit Date"];
					var svgContainer = d3.select("body").append("svg")
														.attr("width", "100%")
														.attr("height", rowHeight);

					var circle = svgContainer.append("line")
											.attr("x1", xOffset)
											.attr("y1", rowHeight/2)
											.attr("x2", lineWidth)
											.attr("y2", rowHeight/2)
											.attr("stroke-width", 2)
											.attr("stroke", "black");

					drawProcedures(svgContainer, pid, patients, dateRange);
					drawDrugs(svgContainer, pid, patients, dateRange);
				}
			});
		});
	});

});