
$(document).ready(function(){

	function getDateDiff(date1, date2){
		date1 = date1.split("/")
		date2 = date2.split("/")
		var oneDay = 24*60*60*1000; 
		var d1 = new Date(date1[2],date1[0],date1[1]);
		var d2 = new Date(date2[2],date2[0],date2[1]);

		return Math.round(Math.abs((d1.getTime() - d2.getTime())/(oneDay)));
	}

	function drawProcedures(svgContainer, pid, patients, admit_date){
		if (!(pid in patients)) return

		var colorObj = {
			"Excision": "red",
			"Skin Graft": "green",
			"Other" "black"
		}

		var numProcedures = patients[pid]["dates"].length;

		for (var i = 0; i < numProcedures; i++) {
			console.log("inside loop")
			var diff = getDateDiff(admit_date, patients[pid]["dates"][i])

			var cx = 200 + (1000-200)*diff/365;

			var c = svgContainer.append("circle")
								.attr("cx", cx)
								.attr("cy", 50)
								.attr("r", 5)
								.style("fill", "red");
		}
	}

	d3.csv("../data/enrollment.csv", function(enrollment_data) {
		d3.csv("../data/procedures.csv", function(procedures_data) {

			patients = {}
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

			console.log(patients)

			for (var i = 0; i < enrollment_data.length; i++){

				var pid = enrollment_data[i]["Pt Id"];
				var admit_date = enrollment_data[i]["Admit Date"];

				var svgContainer = d3.select("body").append("svg")
													.attr("width", "100%")
													.attr("height", 100);

				var circle = svgContainer.append("line")
										.attr("x1", 200)
										.attr("y1", 50)
										.attr("x2", 1000)
										.attr("y2", 50)
										.attr("stroke-width", 2)
										.attr("stroke", "black");

				drawProcedures(svgContainer, pid, patients, admit_date);
			}


		});
	});

});