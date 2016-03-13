function loadIrisData(pathToData) {
	var result = [];
	d3.csv(pathToData, function(d) {
		d.forEach(function(e, i) {
			result[i] = [];
			data[i].push(parseFloat(e.sepal_length));
			data[i].push(parseFloat(e.sepal_width));
			data[i].push(parseFloat(e.petal_length));
			data[i].push(parseFloat(e.petal_width));
			data[i].push(parseFloat(e.class));
		});
	});
	return result;
}