export class Segment{

	// type: casteljau, spiro, hobby, arc, etc...
	var type = undefined;

	// next/prev segments will be managed by the path via an array

	constructor(node, type){
		this.endPoint = node;
		this.type = type;
	}
}
