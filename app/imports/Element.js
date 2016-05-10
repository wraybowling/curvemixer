class Element {
	constructor(x,y,parent){
		if(parent !== undefined)
			this.parent = parent;
			this.parent.children.push(this);
		}
		this.selected = false;
		this.classList = [];

		this.x = x;
		this.y = y;
		this.scale = 1.0;
		this.rotation = 0;

		this.guiElement = new XML('use');
		this.guiElement.attr('xlink:href','#dot');
	}

	translate(x,y){
		this.x += x;
		this.y += y;
	}

	translateOrigin(x,y){
		for(let p=0; p<this.points.length; p++){
			this.points[p].x += x;
			this.points[p].y += y;
		}
	}

	addClass(name){
		this.classList.push(name);
		return this;
	}

}
