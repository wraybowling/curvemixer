
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


////


function HANDLE(type,point){
	this.type = type || 'free'; // straight, catmul-rom, free
	this.point = point;
}

window.HANDLE = HANDLE;


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


////


function CHAIN(start){
	this.start = new POINT(start);
	this.segments = [];
}

CHAIN.prototype.addSegment = function(segment,index){
	if(index === undefined){
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

window.OBJECT = OBJECT;


////


function GROUP(super,options){
	this.selected = false;
	this.contains = [];

	options = options || {};
	if(options.translate !== undefined)
		this.translate = {x: options.translate.x, y: options.translate.y};
	if(options.scale !== undefined)
		this.scale = options.scale;
	if(options.rotate !== undefined)
		this.rotate = options.rotate;

	this.render();
	return this;
}

GROUP.prototype.translate = function(translation_delta) {
	this.translate.x += translation_delta.x;
	this.translate.y += translation_delta.y;
	return this;
};

GROUP.prototype.render = function(){
	var dot = new XML('circle');
	dot.attr('cx',this.translate.x);
	dot.attr('cy',this.translate.y);
	dot.attr('r',4);
	dot.attr('class','group');
	this.interface.appendChild(dot.element);
	return this;
}

window.GROUP = GROUP;


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
	this.gui = element.querySelector('.gui');

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
	var self = this;
	this.element.onmousemove = function(event){ self.mousemove(event); };
	this.element.onmousedown = function(event){ self.mousedown(event); };
	this.element.onmouseup = function(event){ self.mouseup(event); };
	this.element.onmousewheel = function(event){ self.mousewheel(event); };
	this.element.onkeydown = function(event){ self.keydown(event); };
	this.element.onkeyup = function(event){ self.keyup(event); };
}

// Render functions
CURVEMIXER.prototype.renderInterface = function() {
	console.log('Building gui');
	var i;

	current_circles = this.gui.querySelectorAll('circle');
	for(i=0; i<current_circles.length; i++){
		current_circles[i].remove();
	}

	for(i=0; i<this.anchors.length; i++){
		var dot = new XML('circle');
		dot.attr('cx',this.anchors[i].coordinates.x);
		dot.attr('cy',this.anchors[i].coordinates.y);
		dot.attr('r',3);
		this.gui.appendChild(dot.element);
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

	//window.activeCurvemixer = this;
	//console.log(this);
/*
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
*/
	// set previous to current
	this.prevX = event.x;
	this.prevY = event.y;
};

CURVEMIXER.prototype.mousedown = function(event){
	console.log('mouse down',event);
};

CURVEMIXER.prototype.mouseup = function(event){
	console.log('mouse up',event);
//		this.RenderInterface();
//	var new_anchor = new ANCHOR('M',event);
//	console.log(new_anchor);
//	mixer.anchors.push(new_anchor);
//	mixer.renderInterface();
//	mixer.renderPaths();
};

CURVEMIXER.prototype.mousewheel = function(event){
	event.preventDefault();
	console.log('wheel',event);
};

CURVEMIXER.prototype.keydown = function(event){
	event.preventDefault();
	console.log('keydown',event.keyCode);

	if( ! this.states.keyDown){
		switch(event.keyCode){
			case 20: console.log('edit mode'); this.states.editing = true; break;
			case 9: console.log('making group'); this.groups.push( new GROUP({translate:{x:this.prevX, y:this.prevY}}) ); break;
			// case 76:mixer.selected_anchor_type = 'L'; break;
			// case 72:mixer.selected_anchor_type = 'H'; break;
			// case 86:mixer.selected_anchor_type = 'V'; break;
			// case 67:mixer.selected_anchor_type = 'C'; break;
			// case 83:mixer.selected_anchor_type = 'S'; break;
			// case 81:mixer.selected_anchor_type = 'Q'; break;
			// case 84:mixer.selected_anchor_type = 'T'; break;
			// case 65:mixer.selected_anchor_type = 'A'; break;

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

	//console.log('anchor type',mixer.selected_anchor_type);
	//console.log('mode',mixer.mode);
	this.states.keyDown = true;
};

CURVEMIXER.prototype.keyup = function(event){
//	event.preventDefault();
	console.log('key up',event.keyCode);

	switch(event.keyCode){
		case 20: console.log('object mode'); this.states.editing = false; break;
		case 71:
			mixer.mode = null;
			mixer.selected_anchor_index = null;
	}

	mixer.states.keyDown = false;

};

window.CURVEMIXER = CURVEMIXER;

})( window );
