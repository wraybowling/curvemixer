import "element";

class Path extends Element{
	var segments = [];
	    element = undefined;

	constructor(x,y,parent){
		super(x,y,parent);
		this.element = new XML('Path');
	}

	getPathData(){
		for(let i=0; i<this.chains.length; i++){
		  for(j=0; j<this.chains[i].segments.length; j++){
		    pathData.push('L');
		    pathData.push(this.chains[i].segments[j].anchor.x);
		    pathData.push(this.chains[i].segments[j].anchor.y);
		  }
		}
	}
}
