
// GLOBALS
function distance(Xa,Ya,Xb,Yb){
	return Math.sqrt(Math.pow((Xb - Xa),2) + Math.pow((Yb - Ya),2));
}

// CURVEMIXER
//
// Curvemixer: contains all groups, objects, chains, segments, & points. Renders UI & handles mouse/keyboard/touch events.
// v v v
// Group: contains objects and other groups
// v v v
// Object: contains Chains
// v v v
// Chain: a list of segments that are connected and share the same type. Used for processing meta-curves into castle-curves.
// v v v
// Segment: has curve type, one end anchor Point, up to two Handle Points. is aware of "previous" and "next" Segments.
// v v v
// Point: a set of x,y coordinates
// v v v
// Handle: a point that has a casteljau type: straight, catmul-rom, free
//
( function( window ) {
'use strict';


////


function POINT(x,y){
	this.x = x;
	this.y = y;
	this.selected = false;
}

POINT.prototype.setCoordinates = function(x,y){
	this.x = x;
	this.y = y;
};

window.POINT = POINT;
var p = new POINT(100,100);
console.log('test point', p);


////


function HANDLE(type,point){
	this.type = type || 'free'; // straight, catmul-rom, free
	this.point = point;
}

window.HANDLE = HANDLE;
var h = new HANDLE(200,100,'free');
var h2 = new HANDLE(300,100);
console.log('test handles',h,h2);


////


function SEGMENT(type,anchor,handles){
	this.anchor = anchor; // end point
	this.type = type; // spiro, casteljau, linear, et cetera

	this.theta = undefined;
	this.locked = false;

//	this.handleCount = this.types[type].handleCount;
	this.handleList = [];

	this.prev = undefined; // prev anchor
	this.next = undefined; // next anchor
}

SEGMENT.prototype.types = {
	'Castel Curve 1' : { handleCount:1 },
	'Castel Curve 2' : { handleCount:2, handleTypes:['straight', 'free', 'catmul-rom']},
	'Vertical' : { handleCount:0, noLocking:true },
	'Horizontal' : { handleCount:0, noLocking:true },
	'Arc' : { handleCount:1 },
	'Spiro' : { handleCount:0 },
	'PenUp' : { handleCount:0 } // used for breaking chains
};

window.SEGMENT = SEGMENT;
var s = new SEGMENT('linear', p);
console.log('test segment',s);


////


function CHAIN(start){
	this.start = new POINT(start);
	this.segments = [];
}

CHAIN.prototype.addSegment = function(segment,index){
	if(index == undefined){
		this.segments.push(segment);
	}else{
		this.segments.splice(index, 0, segment);
	}
};

CHAIN.prototype.catmullRom = function(closed) {
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

window.CHAIN = CHAIN;
var m = new POINT(800,800);
var c = new CHAIN(m);
c.addSegment(s);
console.log('test chain',c);


////


function OBJECT(){
	this.selected = false;
	this.segments = [];
	this.chains = [];
	this.classList = [];
}

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


////


function GROUP(properties){
	this.selected = false;
	this.translate = {x: properties.translate.x, y: properties.translate.y};
	this.scale = {x: properties.scale.x, y: properties.scale.y};
	this.rotate = properties.rotate;
	this.contains = [];
}

GROUP.prototype.translate = function(translation_delta) {
	this.translate.x += translation_delta.x;
	this.translate.y += translation_delta.y;
};


////


function XML(name){
	var namespace = 'http://www.w3.org/2000/svg';
	this.element = document.createElementNS(namespace,name);
}

XML.prototype.attr = function(name,value){
	this.element.setAttributeNS(null,name,value);
};

window.XML = XML;
var x = new XML('g');
console.log('xml',x);


////


function CURVEMIXER(element){
	// DOM elements
	this.element = element;
	this.stage = element.querySelector('.stage');
	this.interface = element.querySelector('.interface');

	// data
	this.groups = [];
	this.objets = [];
	this.chains = [];
	this.segments = [];
	this.points = [];

	// states
	this.states = {
		editing: false,
		grabbing: false,
		rotating: false,
		scaling: false,
		lockX: false,
		lockY: false,
		flipping: false, // horizontal and vertical flips
		sorting: false, // move selected forward and back interactively
		keyDown: false,
		mouseDown: false,
		touchDown: false
	};
	this.prevX = 0;
	this.prevY = 0;
	this.closest_anchor_index = 0;
	this.selected_anchor_type = null;
	this.selected_anchor_index = null;

	// Attach DOM Listeners
//	this.container.onmousemove = this.mousemove;
//	this.container.onmousedown = this.mousedown;
//	this.container.onmouseup = this.mouseup;
//	this.container.onmousewheel = this.mousewheel;
	window.addEventListener("keydown", this.keydown);
	window.addEventListener("keyup", this.keyup);
}

// Render functions
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

CURVEMIXER.prototype.render = function() {
	console.log('Rendering Mixer');
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
	console.log('key dn',event.keyCode,event);
	console.log('this',this);

	if( ! mixer.states.keyDown){
		switch(event.keyCode){
			case 9: console.log('tab'); break;
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
				break;
		}
	}

	console.log('anchor type',mixer.selected_anchor_type);
	console.log('mode',mixer.mode);
	mixer.states.keyDown = true;
};

CURVEMIXER.prototype.keyup = function(event){
	//event.preventDefault();
	switch(event.keyCode){
		case 71:
			mixer.mode = null;
			mixer.selected_anchor_index = null;
	}
//		console.log('key up',event.keyCode,event);
	mixer.states.keyDown = false;
};

window.CURVEMIXER = CURVEMIXER;

})( window );


//////////

var mixer_el = document.querySelector('.curvemixer_container');
var mixer = new CURVEMIXER(mixer_el);

//////////

