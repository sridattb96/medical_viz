
console.log("test")

d3.csv("data/antimicrobial.csv", function(data) {
  // console.log(data[0]["Dose"]);
});

d3.csv("data/sample.csv", function(data) {
  // console.log(data[1]);
});

d3.csv("data/subject_status.csv", function(data) {
	// console.log(data[0])

	obj = {}
	for (var i = 0; i < data.length; i++){
		var group = data[i]["Patient Current status"];
		if (!obj[group]){
			obj[group] = 1;
		} else {
			obj[group]++;
		}
	}
	console.log(obj)
});

d3.csv("data/sample.csv", function(data) {
	console.log(data[0])


	obj = {}
	for (var i = 0; i < data.length; i++){
		var group = data[i]["Blood Result 1"];
		if (!obj[group]){
			obj[group] = 1;
		} else {
			obj[group]++;
		}
	}

	console.log(obj)

	culture_type = {}
	for (var i = 0; i < data.length; i++){
		var group = data[i]["Culture Type"];
		if (!culture_type[group]){
			culture_type[group] = 1;
		} else {
			culture_type[group]++;
		}
	}

	console.log(culture_type)
});

d3.csv("data/enrollment.csv", function(data) {

	// Gets count of groups 
	obj = {}
	for (var i = 0; i < data.length; i++){
		var group = data[i]["Group"];
		if (!obj[group]){
			obj[group] = 1;
		} else {
			obj[group]++;
		}
	}

	// sys vs dya scatter plot 
	bp_sys = [];
	bp_dya = [];
	for (var i = 0; i < data.length; i++){
		bp_sys.push(data[i]["BP Systolic"])
		bp_dya.push(data[i]["BP Dyastolic"])
	}

	// createScatter(bp_sys, bp_dya)

	function createScatter(xdata, ydata){

		// size and margins for the chart
		var margin = {top: 20, right: 15, bottom: 60, left: 60}
		  , width = 960 - margin.left - margin.right
		  , height = 500 - margin.top - margin.bottom;

		// x and y scales, I've used linear here but there are other options
		// the scales translate data values to pixel values for you
		var x = d3.scale.linear()
		          .domain([0, 247])  // the range of the values to plot
		          .range([ 0, width ]);        // the pixel range of the x-axis
		console.log(d3.max(xdata))

		var y = d3.scale.linear()
		          .domain([0, 151])
		          .range([ height, 0 ]);
		console.log(d3.max(ydata))


		// the chart object, includes all margins
		var chart = d3.select('body')
		.append('svg:svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')

		// the main object where the chart and axis will be drawn
		var main = chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main')   

		// draw the x axis
		var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

		main.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('class', 'main axis date')
		.call(xAxis);

		// draw the y axis
		var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left');

		main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'main axis date')
		.call(yAxis);

		// draw the graph object
		var g = main.append("svg:g"); 

		g.selectAll("scatter-dots")
		  .data(ydata)  // using the values in the ydata array
		  .enter().append("svg:circle")  // create a new circle for each value
		      .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
		      .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
		      .attr("r", 5) // radius of circle
		      .style("opacity", 0.6); // opacity of circle
	}

	// admits per month
	hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	for (var i = 0; i < data.length; i++){
		month = data[i]["Enroll Date"].split('/')[0]
		hist[month-1]++;
	}
	console.log(hist)

	// # of patients with medical history
	var count = 0;
	for (var i = 0; i < data.length; i++){
		if (data[i]["Past Medical"] != "[None]") count++;
	}

	console.log(count);

});


d3.csv("data/end_of_study.csv", function(data) {
	count = 0;
	withdrawal = 0;
	for (var i = 0; i < data.length; i++){
		if (data[i]["Cause of Death"]){
			count++;
		}
		if (data[i]["Explain Withdrawal"]){
			withdrawal++;
		}
	} 
	console.log(count)
	console.log(withdrawal)
});