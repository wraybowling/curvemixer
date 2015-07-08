class Path extends Element{
	constructor(x,y,parent){
		super(x,y,parent);
		this.element = new XML('Path');
	}

	get html(){
		// render GUI
		if(this.element === undefined){
			var dot = new XML('circle');
			dot.attr('cx',this.x);
			dot.attr('cy',this.y);
			dot.attr('r',4);
			dot.attr('class','object');
			this.element = this.owner.gui.appendChild(dot.element);
			console.log('create new object element',this.element);
			console.log('dot',dot);
		}else{
			console.log('reposition object element',this.element);
			this.element.setAttributeNS(null,'cx',this.x);
			this.element.setAttributeNS(null,'cy',this.y);
		}

		// render Path
		if(this.pathEl === undefined){
			this.pathEl = new XML('path');
		}
		var pathData = ['M 100,100'];
		for(let i=0; i<this.chains.length; i++){
			for(j=0; j<this.chains[i].segments.length; j++){
				pathData.push('L');
				pathData.push(this.chains[i].segments[j].anchor.x);
				pathData.push(this.chains[i].segments[j].anchor.y);
			}
		}
	}
}