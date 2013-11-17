function casteljau(points,options){
	if(points.length == 4){
		console.log('Casteljau 4');
	}
	if(points.length == 3){
		console.log('Casteljau 3');
	}
}

function hobby(points,options){
	points = points || [];
	tension = options.tension || 1;
	offset = options.offset || [0,0];
	cycle = options.cycle || true;
	debug = options.debug || false;

	// set 3D default
	offset.z = offset.z || 0;

	// if closed shape, re-add the first point
	if(cycle){
		points.push(points[0]);
	}

	// arrays to do maths on
	z = []; // points
	w = []; // unit vectors of direction of curve through each point
	tin = []; // tension of curve in to point
	tout = []; // tension of curve out from point

	for (var i = 0; i < points.length; i++) {
		console.log(points[i]);

		w[i] = [];
		tin[i] = tension;
		tout[i] = tension;
//bookmark
		if(points.length == 2){
			z[i] = offset + [points[i][0],0]
		}else{
			z[i] = offset + points[0]
		}

	}

	casteljau([P1,P2,P3,P4]);
}