// Curvemixer
// Group > Object > Chain > Segment (holds type and modulus) > Point (handle or anchor. interchangeable)


( function( window ) {
"use strict";

// GLOBALS
function distance(Xa,Ya,Xb,Yb){
	return Math.sqrt(Math.pow((Xb - Xa),2) + Math.pow((Yb - Ya),2));
}


////


function POINT(ex,wai){
	this.x = ex;
	this.y = wai;
//	this.selected = false;
}

POINT.prototype.setCoordinates = function(x,y){
	this.x = x;
	this.y = y;
};

window.POINT = POINT;
var p = new POINT(100,100);
console.log('test point', p);


////


function SEGMENT(coordinates,algorithm,options){
	this.anchor = POINT(coordinates); // end point
	this.algorithm = algorithm; // spiro, casteljau, linear, et cetera

	this.theta = args.theta;
	this.locked = options.locked;

	this.handles = args.handles; // array of POINTs

	this.chain = args.chain; // parent chain
	this.prev = args.prev; // prev anchor
	this.next = args.next; // next anchor
}

/*

////

function CHAIN(){
	this.
}

CHAIN.prototype.catmullRom2bezier = function(closed) {
	// converts catmul-rom points into cornered cubic castel curve points (3 coordinates)
	// coordinates (array)
	// closed (Boolean) if the shape is closed or not
	var d = [], i, iLen, p;
	for (i = 0, iLen = coordinates.length; (iLen - 2 * !closed) > i; i += 2) {
		p = [
			{x: +coordinates[i - 2], y: +coordinates[i - 1]},
			{x: +coordinates[i],     y: +coordinates[i + 1]},
			{x: +coordinates[i + 2], y: +coordinates[i + 3]},
			{x: +coordinates[i + 4], y: +coordinates[i + 5]}
		];
		if (closed) {
			if (!i) {
				p[0] = {x: +coordinates[iLen - 2], y: +coordinates[iLen - 1]};
			} else if (iLen - 4 === i) {
				p[3] = {x: +coordinates[0], y: +coordinates[1]};
			} else if (iLen - 2 === i) {
				p[2] = {x: +coordinates[0], y: +coordinates[1]};
				p[3] = {x: +coordinates[2], y: +coordinates[3]};
			}
		} else {
			if (iLen - 4 === i) {
				p[3] = p[2];
			} else if (!i) {
				p[0] = {x: +coordinates[i], y: +coordinates[i + 1]};
			}
		}
		d.push("C");

		d.push((-p[0].x + 6 * p[1].x + p[2].x) / 6);
		d.push((-p[0].y + 6 * p[1].y + p[2].y) / 6);

		d.push((p[1].x + 6 * p[2].x - p[3].x) / 6);
		d.push((p[1].y + 6 * p[2].y - p[3].y) / 6);

		d.push(p[2].x);
		d.push(p[2].y);
	}

	return d;
};

var a = new ANCHOR(p,'linear',{});
console.log('test anchor',a);


////



function XML(name){
	var namespace = 'http://www.w3.org/2000/svg';
	this.element = document.createElementNS(namespace,name);
}

XML.prototype.attr = function(name,value){
	this.element.setAttributeNS(null,name,value);
};


// MASTER CLASS


function CURVEMIXER(element){
	// storage
	this.container = typeof element === 'string' ? document.querySelector(element) : element;
	this.interface = element.querySelector('.interface');
	this.stage = element.querySelector('.stage');
	this.mode = null;
	this.groups = [];
	this.states = {
		editing: false,
		grabbing: false,
		rotating: false,
		scaling: false,
		lockX: false,
		lockY: false,
		flipping: false, // horizontal and vertical flips
		sorting: false // move selected forward and back interactively
	};
	this.prevX = 0;
	this.prevY = 0;
	this.closest_anchor_index = 0;
	this.selected_anchor_type = null;
	this.selected_anchor_index = null;

	// Attach DOM Listeners
	this.container.onmousemove = this.mousemove;
	this.container.onmousedown = this.mousedown;
	this.container.onmouseup = this.mouseup;
	this.container.onmousewheel = this.mousewheel;
	window.addEventListener("keydown", this.keydown);
	window.addEventListener("keyup", this.keyup);
}

// Render
CURVEMIXER.prototype.renderInterface = function() {
	console.log('Building interface');
	var i;

	current_circles = this.interface.querySelectorAll('circle');
	for(i=0; i<current_circles.length; i++){
		current_circles[i].remove();
	}

	for(i=0; i<this.anchors.length; i++){
		var dot = new XML('circle');
		dot.attr('cx',this.anchors[i].coordinates.x);
		dot.attr('cy',this.anchors[i].coordinates.y);
		dot.attr('r',3);
		this.interface.appendChild(dot.element);
	}
};

CURVEMIXER.prototype.renderPaths = function() {
	console.log('Building paths');
	var i;

	var final_path = this.stage.querySelector('.final_stage');

	data = [];
	for(i=0; i<this.anchors.length; i++){
		if(i===0) this.anchors[i].type = 'M';
		if(!!this.anchors[i].type) data.push(this.anchors[i].type);
		switch(this.anchors[i].type){
			case 'H':
				data.push(this.anchors[i].coordinates.x);
				break;
			case 'V':
				data.push(this.anchors[i].coordinates.y);
				break;
			default:
				data.push(this.anchors[i].coordinates.x+','+this.anchors[i].coordinates.y);
		}
	}
	if(this.closed){
		data.push('z');
	}

	final_path.setAttributeNS(null,'d',data.join(' '));


//	var path_index = 0;
//	var anchor_index = 0;
//	for(; path_index<this.paths.length; path_index++){
//		var doop = new XML('circle');
//		for(var i=0; i<this.paths[path_index].anchor_count; i++){
//			var doop = new XML('circle');
//			doop.attr('cx',this.anchors[i].coordinates.x);
//			doop.attr('cy',this.anchors[i].coordinates.y);
//			doop.attr('r',3);
//			this.interface.appendChild(doop.element);
//		}
//	}

};

// Event functions
CURVEMIXER.prototype.mousemove = function(event){

	// move selected anchor
	if(mixer.mode == 'move'){
		console.log(event);
		mixer.anchors[mixer.selected_anchor_index].coordinates.x += event.x - mixer.prevX;
		mixer.anchors[mixer.selected_anchor_index].coordinates.y += event.y - mixer.prevY;
		mixer.renderInterface();
		mixer.renderPaths();
	}

//		console.log('move',event);
	//RenderInterface();

	// determine closest anchor
	mixer.closest_anchor_distance = 9999;
	mixer.closest_anchor_index = 0;

//		console.group('distance');
	for(var i=0; i<mixer.anchors.length; i++){
		var anchor = mixer.anchors[i];

		var new_distance = distance(anchor.coordinates.x, anchor.coordinates.y, event.x, event.y);

		if(new_distance < mixer.closest_anchor_distance ){
			mixer.closest_anchor_distance = new_distance;
			mixer.closest_anchor_index = i;
//				console.log('shorter',distance(anchor.coordinates.x, anchor.coordinates.y, event.x, event.y));
		}else{
//				console.log('longer');
		}
	}
//		console.groupEnd();

	// display line to nearest anchor
	result = ['M'];
	result.push(event.x + ',' + event.y);
	result.push('L' + mixer.anchors[mixer.closest_anchor_index].coordinates.x + ',' + mixer.anchors[mixer.closest_anchor_index].coordinates.y);
	var d = result.join(' ');

	mixer.interface.querySelector('.selection-line').setAttributeNS(null,'d',d);

	// set previous to current
	mixer.prevX = event.x;
	mixer.prevY = event.y;
};

CURVEMIXER.prototype.mousedown = function(event){
	console.log('down',event);
};

CURVEMIXER.prototype.mouseup = function(event){
	console.log('up',event);
//		this.RenderInterface();
	var new_anchor = new ANCHOR('M',event);
	console.log(new_anchor);
	mixer.anchors.push(new_anchor);
	mixer.renderInterface();
	mixer.renderPaths();
};

CURVEMIXER.prototype.mousewheel = function(event){
	event.preventDefault();
	console.log('wheel',event);
};

CURVEMIXER.prototype.keydown = function(event){
	event.preventDefault();
//		console.log('key dn',event.keyCode,event);
	switch(event.keyCode){
		case 76:mixer.selected_anchor_type = 'L'; break;
		case 72:mixer.selected_anchor_type = 'H'; break;
		case 86:mixer.selected_anchor_type = 'V'; break;
		case 67:mixer.selected_anchor_type = 'C'; break;
		case 83:mixer.selected_anchor_type = 'S'; break;
		case 81:mixer.selected_anchor_type = 'Q'; break;
		case 84:mixer.selected_anchor_type = 'T'; break;
		case 65:mixer.selected_anchor_type = 'A'; break;

		case 90: // Z
			mixer.closed = !mixer.closed;
			mixer.renderPaths();
			break;

		case 71: // G
			mixer.mode = 'move';
			mixer.selected_anchor_index = mixer.closest_anchor_index;
	}
	console.log('anchor type',mixer.selected_anchor_type);
	console.log('mode',mixer.mode);
};

CURVEMIXER.prototype.keyup = function(event){
	//event.preventDefault();
	switch(event.keyCode){
		case 71:
			mixer.mode = null;
			mixer.selected_anchor_index = null;
	}
//		console.log('key up',event.keyCode,event);
};





// GROUP CLASS
// Collections of objects. Most macro level. groups can contain other groups.
//	properties = {
//		translate : {x,y}
//		,scale : xy
//		,rotate : r
//	}
function GROUP(properties){
	this.selected = false;
	this.translate = {x: properties.translate.x, y: properties.translate.y};
	this.scale = {x: properties.scale.x, y: properties.scale.y};
	this.rotate = properties.rotate;
	this.contains = [];
};

GROUP.prototype.translate = function(translation_delta) {
	this.translate.x += translation_delta.x;
	this.translate.y += translation_delta.y;
};

// OBJECT CLASS
function OBJECT(){
	this.selected = false;
	this.chains = [];
	this.classList = [];
};

OBJECT.prototype.translateOrigin = function(translation_delta){
	var c,p;
	for(c=0; c<this.chains.length; c++){
		for(p=0; p<this.chains[c].points.length; p++){
			this.chains[c].points[p].x += translation_delta.x;
			this.chains[c].points[p].y += translation_delta.y;
		}
	}
};

OBJECT.prototype.addClass = function(name){
	this.classList.push(name);
};

// CHAIN CLASS
function CHAIN(){
	this.segments = [];
};

var SEGMENT_TYPES = {
	'Castel Curve 1' : { handles:1 },
	'Castel Curve 2' : { handles:2, handle_types:['straight', 'free']},
	'Vertical' : { handles:0, no_locking:true },
	'Horizontal' : { handles:0, no_locking:true },
	'Arc' : { handles:1 },
	'Spiro' : { handles:0 },
};

// SEGMENT CLASS
function SEGMENT(parameters){
	this.algorithm = parameters.algorithm || 'Castel Curve 2';
	this.type = parameters.type || 'S';
	this.locked_with_previous = false;
};



//////////

mixer = CURVEMIXER(document.querySelector('.mixablz'));

//////////

var g = GROUP({translate: {x:100, y:100}, rotation:0, scale:1});
mixer.groups.push( g );
mixer.groups[0].push(  );

// mixer.paths.push( new PATH() );

*/
})( window );