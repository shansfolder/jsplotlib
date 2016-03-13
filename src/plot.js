/**  plot(X,Y) plots vector Y versus vector X. If X or Y is a matrix,
*    then the vector is plotted versus the rows or columns of the matrix,
*    whichever line up.  If X is a scalar and Y is a vector, disconnected
*    line objects are created and plotted as discrete points vertically at
*    X.
*/
function plot(X, Y, labels) {
	if (isVector(X) && isVector(Y)) {
		if (X.length != Y.length) {
			throw "Vectors must be the same length."; 
		}
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

		var x = d3.scale.linear()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var color = d3.scale.category10();

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.append("rect")
			.attr("class", "plotArea")
            .attr("width",width)
            .attr("height",height)
            .style("opacity",0);

		x.domain(d3.extent(X)).nice();
	  	y.domain(d3.extent(Y)).nice();

	  	svg.append("g")
	      	.attr("class", "x axis")
	      	.attr("transform", "translate(0," + height + ")")
	      	.call(xAxis)
	      .append("text")
	      	.attr("class", "label")
	      	.attr("x", width)
	      	.attr("y", -6)
	      	.style("text-anchor", "end")
	      	.text("x");
	      	// .text("Sepal Width (cm)");

	  	svg.append("g")
	      	.attr("class", "y axis")
	      	.call(yAxis)
	      .append("text")
	      	.attr("class", "label")
	      	.attr("transform", "rotate(-90)")
	      	.attr("y", 6)
	      	.attr("dy", ".71em")
	      	.style("text-anchor", "end")
	      	.text("y");
	      	// .text("Sepal Length (cm)")

	  	svg.selectAll(".dot")
	      	.data(X.map(function (d,i) {return [X[i], Y[i], labels[i]];}))
	      .enter().append("circle")
	      	.attr("id",function(d,i) {return "dot_" + i;}) // added
	      	.attr("class", "dot")
	      	.attr("r", 3)
	      	.attr("cx", function(d) { return x(d[0]); })
	      	.attr("cy", function(d) { return y(d[1]); })
	      	.style("fill", function(d) { return color(d[2]); });

	  	var legend = svg.selectAll(".legend")
	      	.data(color.domain())
	      .enter().append("g")
	      	.attr("class", "legend")
	      	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  	legend.append("rect")
	      	.attr("x", width - 18)
	      	.attr("width", 18)
	      	.attr("height", 18)
	      	.style("fill", color);

	  	legend.append("text")
	      	.attr("x", width - 24)
	      	.attr("y", 9)
	      	.attr("dy", ".35em")
	      	.style("text-anchor", "end")
	      	.text(function(d) { return d; });	
                    
	    return svg;
	}	
}

function isVector(X) {
	return true;
}




