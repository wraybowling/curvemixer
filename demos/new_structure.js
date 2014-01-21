( function( window ) {
"use strict";

function CLASS(args){ this.init(args); }
CLASS.prototype = {
	x: undefined
	,y: undefined
	,z: undefined
	,init: function(args){
		this.x = args.x;
		this.y = args.y;
	}
};

})( window );