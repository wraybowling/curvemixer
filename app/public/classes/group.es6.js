import "element";

Group extends Element{
	constructor(x,y,parent){
		super(x,y,parent);
		this.children = [];
		this.parent = parent;
	}
}
