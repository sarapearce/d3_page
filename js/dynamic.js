$(document).ready(function () {
//    addEvents();
//    popGraph();
//    barGraph();
      rects();
});

function addEvents() {

}

function barGraph() {

    var data = [4, 8, 15, 16, 23, 42];

    var x = d3.scale.linear()
	    .domain([0, d3.max(data)])
	    .range([0, 420]);

    d3.select(".chart")
	    .selectAll("div")
	    .data(data)
	    .enter().append("div")
	    .style("width", function (d) {
		return x(d) + "px";
	    })
	    .text(function (d) {
		return d;
	    });
}


function popGraph() {
    var margin = {top: 20, right: 40, bottom: 30, left: 20},
    width = 600 - margin.left - margin.right,
	    height = 323 - margin.top - margin.bottom,
	    barWidth = Math.floor(width / 19) - 1;

    var x = d3.scale.linear()
	    .range([barWidth / 2, width - barWidth / 2]);

    var y = d3.scale.linear()
	    .range([height, 0]);

    var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("right")
	    .tickSize(-width)
	    .tickFormat(function (d) {
		return Math.round(d / 1e6) + "M";
	    });

// An SVG element with a bottom-right origin.
    var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// A sliding container to hold the bars by birthyear.
    var birthyears = svg.append("g")
	    .attr("class", "birthyears");

// A label for the current year.
    var title = svg.append("text")
	    .attr("class", "title")
	    .attr("dy", ".71em")
	    .text(2000);

    d3.csv("population.csv", function (error, data) {

	// Convert strings to numbers.
	data.forEach(function (d) {
	    d.people = +d.people;
	    d.year = +d.year;
	    d.age = +d.age;
	});

	// Compute the extent of the data set in age and years.
	var age1 = d3.max(data, function (d) {
	    return d.age;
	}),
		year0 = d3.min(data, function (d) {
		    return d.year;
		}),
		year1 = d3.max(data, function (d) {
		    return d.year;
		}),
		year = year1;

	// Update the scale domains.
	x.domain([year1 - age1, year1]);
	y.domain([0, d3.max(data, function (d) {
		return d.people;
	    })]);

	// Produce a map from year and birthyear to [male, female].
	data = d3.nest()
		.key(function (d) {
		    return d.year;
		})
		.key(function (d) {
		    return d.year - d.age;
		})
		.rollup(function (v) {
		    return v.map(function (d) {
			return d.people;
		    });
		})
		.map(data);

	// Add an axis to show the population values.
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + width + ",0)")
		.call(yAxis)
		.selectAll("g")
		.filter(function (value) {
		    return !value;
		})
		.classed("zero", true);

	// Add labeled rects for each birthyear (so that no enter or exit is required).
	var birthyear = birthyears.selectAll(".birthyear")
		.data(d3.range(year0 - age1, year1 + 1, 5))
		.enter().append("g")
		.attr("class", "birthyear")
		.attr("transform", function (birthyear) {
		    return "translate(" + x(birthyear) + ",0)";
		});

	birthyear.selectAll("rect")
		.data(function (birthyear) {
		    return data[year][birthyear] || [0, 0];
		})
		.enter().append("rect")
		.attr("x", -barWidth / 2)
		.attr("width", barWidth)
		.attr("y", y)
		.attr("height", function (value) {
		    return height - y(value);
		});

	// Add labels to show birthyear.
	birthyear.append("text")
		.attr("y", height - 4)
		.text(function (birthyear) {
		    return birthyear;
		});

	// Add labels to show age (separate; not animated).
	svg.selectAll(".age")
		.data(d3.range(0, age1 + 1, 5))
		.enter().append("text")
		.attr("class", "age")
		.attr("x", function (age) {
		    return x(year - age);
		})
		.attr("y", height + 4)
		.attr("dy", ".71em")
		.text(function (age) {
		    return age;
		});

	// Allow the arrow keys to change the displayed year.
	window.focus();
	d3.select(window).on("keydown", function () {
	    switch (d3.event.keyCode) {
		case 37:
		    year = Math.max(year0, year - 10);
		    break;
		case 39:
		    year = Math.min(year1, year + 10);
		    break;
	    }
	    update();
	});

	function update() {
	    if (!(year in data))
		return;
	    title.text(year);

	    birthyears.transition()
		    .duration(750)
		    .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

	    birthyear.selectAll("rect")
		    .data(function (birthyear) {
			return data[year][birthyear] || [0, 0];
		    })
		    .transition()
		    .duration(750)
		    .attr("y", y)
		    .attr("height", function (value) {
			return height - y(value);
		    });
	}
    });
}

function rects() {
    var mouse = [480, 250],
	    count = 0;

    var svg = d3.select("body").append("svg")
	    .attr("width", 960)
	    .attr("height", 500);

    var g = svg.selectAll("g")
	    .data(d3.range(25))
	    .enter().append("g")
	    .attr("transform", "translate(" + mouse + ")");

    g.append("rect")
	    .attr("rx", 6)
	    .attr("ry", 6)
	    .attr("x", -12.5)
	    .attr("y", -12.5)
	    .attr("width", 25)
	    .attr("height", 25)
	    .attr("transform", function (d, i) {
		return "scale(" + (1 - d / 25) * 20 + ")";
	    })
	    .style("fill", d3.scale.category20c());

    g.datum(function (d) {
	return {center: mouse.slice(), angle: 0};
    });

    svg.on("mousemove", function () {
	mouse = d3.mouse(this);
    });

    d3.timer(function () {
	count++;
	g.attr("transform", function (d, i) {
	    d.center[0] += (mouse[0] - d.center[0]) / (i + 5);
	    d.center[1] += (mouse[1] - d.center[1]) / (i + 5);
	    d.angle += Math.sin((count + i) / 10) * 7;
	    return "translate(" + d.center + ")rotate(" + d.angle + ")";
	});
    });

}