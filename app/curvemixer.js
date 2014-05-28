
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
	this.k = undefined; // curvature as the curve approaches the anchor
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


function OBJECT(owner,options){
	console.group('Object created', this);
	this.owner = owner;
	this.selected = false;
	this.segments = [];
	this.chains = [];
	this.classList = [];

	options = options || {};
	this.x = options.x || 0;
	this.y = options.y || 0;

	this.render();

	console.groupEnd();
	return this;
}

OBJECT.prototype.translateOrigin = function(translation_delta){
	var c,p;
	for(c=0; c<this.chains.length; c++){
		for(p=0; p<this.chains[c].points.length; p++){
			this.chains[c].points[p].x += translation_delta.x;
			this.chains[c].points[p].y += translation_delta.y;
		}
	}
	return this;
};

OBJECT.prototype.addClass = function(name){
	this.classList.push(name);
	return this;
};

OBJECT.prototype.render = function(){
	var dot = new XML('circle');
	dot.attr('cx',this.x);
	dot.attr('cy',this.y);
	dot.attr('r',4);
	dot.attr('class','object');
	console.log('interface?????',this.owner);
	this.owner.gui.appendChild(dot.element);
	return this;
};

window.OBJECT = OBJECT;


////


function GROUP(owner,options){
	this.selected = false;
	this.contains = [];
	this.owner = owner;

	options = options || {};
	this.x = options.x || 0;
	this.y = options.y || 0;

	if(options.scale !== undefined)
		this.scale = options.scale;
	if(options.rotate !== undefined)
		this.rotate = options.rotate;

	this.render();
	return this;
}

GROUP.prototype.translate = function(translation_delta) {
	this.x += translation_delta.x;
	this.y += translation_delta.y;
	return this;
};

GROUP.prototype.render = function(){
	var dot = new XML('circle');
	dot.attr('cx',this.x);
	dot.attr('cy',this.y);
	dot.attr('r',4);
	dot.attr('class','group');
	console.log('interface?????',this.owner);
	this.owner.gui.appendChild(dot.element);
	return this;
};

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
	this.selection_line = element.querySelector('.gui .selection-line');

	// data
	this.groups = [];
	this.objects = [];
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
	this.selected_type = null;
	this.selected = undefined;

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
	var i;

	// group manipulation mode
	if( ! this.states.editing ){
		if(this.groups.length > 0){
//			console.log('a group is here');

			var closest_distance = 9999;
			var closest_index = 0;

			// determine closest group and select it
			for(i=0; i<this.groups.length; i++){
				var new_distance = distance(this.groups[i].x, this.groups[i].y, event.x, event.y);
				if(new_distance < closest_distance){
					closest_distance = new_distance;
					closest_index = i;
				}
			}
			this.selected = this.groups[closest_index];
		}
	}

	if( this.states.grabbing ){
		this.selected.x += event.x - this.prevX;
		this.selected.y += event.y - this.prevY;
		this.selected.render();
	}


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
*/
	// display line to nearest anchor
	if(this.selected != undefined){
		var d = ['M'];
		d.push(event.x + ',' + event.y);
		d.push('L' + this.selected.x + ',' + this.selected.y);
		this.selection_line.setAttributeNS(null,'d',d.join(' '));
	}

	// set previous to current
	this.prevX = event.x;
	this.prevY = event.y;
};

CURVEMIXER.prototype.mousedown = function(event){
	console.log('mouse down',event);
	if(this.states.grabbing) this.states.grabbing = false;
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
			case 20: // caps lock
				console.log('edit mode');
				this.states.editing = true;
				break;
			case 9: // tab
				console.log('making group');
				this.groups.push( new GROUP(this,{x:this.prevX, y:this.prevY}) );
				console.log(this.groups);
				break;
			case 80: // P
				this.objects.push( new OBJECT(this,{x:this.prevX, y:this.prevY}) );
				break;

//			case 76:mixer.selected_anchor_type = 'L'; break;
//			case 72:mixer.selected_anchor_type = 'H'; break;
//			case 86:mixer.selected_anchor_type = 'V'; break;
//			case 67:mixer.selected_anchor_type = 'C'; break;
//			case 83:mixer.selected_anchor_type = 'S'; break;
//			case 81:mixer.selected_anchor_type = 'Q'; break;
//			case 84:mixer.selected_anchor_type = 'T'; break;
//			case 65:mixer.selected_anchor_type = 'A'; break;

//			case 90: // Z
//				mixer.closed = !mixer.closed;
//				mixer.renderPaths();
//				break;

			case 71: // G
				this.states.grabbing = true;
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
