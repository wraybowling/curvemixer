export class Segment{
	constructor(anchor){
		this.anchor = anchor; // endpoint
		this.locked = false;
		this.prev = undefined; // prev anchor
		this.next = undefined; // next anchor
	}
}
