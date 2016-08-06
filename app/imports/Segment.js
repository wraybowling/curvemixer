// next/prev segments will be managed by the path via an array
// type: casteljau, spiro, hobby, arc, etc...

export default class Segment{
	constructor(startNode, endNode, type = undefined){
		this.startNode = startNode;
		this.endNode = endNode;
		this.type = type;

		startNode.nextNode = endNode;
		endNode.previousNode = startNode;
	}
}
