function scatter3d(data, labels) {
	// compte d3 scale
	var xScale = d3.scale.linear()
					.domain([-10,10])
					.range([-50,50]);
	var yScale = d3.scale.linear()
					.domain([-10,10])
					.range([-50,50]);								
	var zScale = d3.scale.linear()
					.domain([-10,10])
					.range([-50,50]);

	// create tree scene
	var scene = new THREE.Scene();
	
	var renderer = new THREE.WebGLRenderer({
		antialias : true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
	document.body.appendChild(renderer.domElement);
	
	var camera = new THREE.PerspectiveCamera(10, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera.position.z = 200;
    camera.position.x = 0;
    camera.position.y = 0;

    // add 3d objetct group
	var scatterPlot = new THREE.Object3D();
    scene.add(scatterPlot);

    // add axis			    
    var axisMat = new THREE.LineBasicMaterial({
        color : 0x000000
    });
    var axisGeo = new THREE.Geometry();
    axisGeo.vertices.push(
    	new THREE.Vector3(xScale(-5), yScale(0), zScale(0)),
    	new THREE.Vector3(xScale(5), yScale(0), zScale(0)),

    	new THREE.Vector3(xScale(0), yScale(-3), zScale(0)),
    	new THREE.Vector3(xScale(0), yScale(3), zScale(0)),

    	new THREE.Vector3(xScale(0), yScale(0), zScale(-5)),
    	new THREE.Vector3(xScale(0), yScale(0), zScale(5))
    );
    var axis = new THREE.LineSegments(axisGeo, axisMat);
    axis.type = THREE.Lines;
    scatterPlot.add(axis);

    // add axis labels
    var spritey = makeTextSprite("X", { fontsize: 12} );
	spritey.position.set(xScale(5) - 1 , 1, 0);
	scatterPlot.add( spritey );

	var spritey = makeTextSprite("Y", { fontsize: 12} );
	spritey.position.set(1, yScale(3) - 1 , 0);
	scatterPlot.add( spritey );

	var spritey = makeTextSprite("Z", { fontsize: 12} );
	spritey.position.set(1, 0, xScale(5) - 1);
	scatterPlot.add( spritey );

	// add point cloud				
	var pointMat = new THREE.PointsMaterial({
        vertexColors : true,
        size : 10
    });
    var color = d3.scale.category20c();
    var dataSize = data.length;

        
    var pointGeo = new THREE.Geometry();
    
    for (var i = 0; i < dataSize; i++) {
    	var x = xScale(projData3d[i][0]);
    	var y = yScale(projData3d[i][1]);
    	var z = zScale(projData3d[i][2]);   
    	var c = labels[i];

    	pointGeo.vertices.push(new THREE.Vector3(x, y, z));
    	pointGeo.colors.push(new THREE.Color(
    		hexToRgb(color(c*25.)).r / 255, hexToRgb(color(c*100.)).g / 255, hexToRgb(color(c*75.)).b / 255
    	));
    }

    scatterPlot.add(new THREE.Points(pointGeo, pointMat));

	    // enable interaction 
    var down = false;
    var sx = 0,
        sy = 0;        
    window.onmousedown = function(ev) {
        down = true;
        sx = ev.clientX;
        sy = ev.clientY;
    };
    window.onmouseup = function() {
        down = false;
    };
    window.onmousemove = function(ev) {
        if (down) {
            var dx = ev.clientX - sx;
            var dy = ev.clientY - sy;
            scatterPlot.rotation.y += dx * 0.01;
            camera.position.y += dy;
            sx += dx;
            sy += dy;
        }
    }

    // render the scene
	renderer.render(scene, camera);
    function run() {
        renderer.clear();
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        window.requestAnimationFrame(run, renderer.domElement);
    };
    run();

    function hexToRgb(hex) { //TODO rewrite with vector output
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
		    b: parseInt(result[3], 16)
        } : null;
    }
    function makeTextSprite(message, parameters) {
		if ( parameters === undefined ) parameters = {};
		
		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";
		
		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 12;				
							
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var metrix = context.measureText(message);
		var textWidth = metrix.width;
		var textHeight = fontsize;
		canvas.width = textWidth+1.5;
		canvas.height = textHeight;
		context.font = "Bold " + textHeight + "px " + fontface;			    
		context.fillText(message, 0, textHeight);
		
		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture} );
		var sprite = new THREE.Sprite( spriteMaterial );
		var actualFontSize = 1;
	    sprite.scale.set(textWidth / textHeight * actualFontSize, actualFontSize, 1);
		return sprite;	
	}
}
