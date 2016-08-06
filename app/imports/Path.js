import {Element} from '/imports/Element.js';
import XML from '/imports/XML.js';

export default class Path extends Element{
	constructor(x,y,segments){
		super(x,y);
		this.documentObject = new XML('path');
		this.segments = segments;
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

	render(){
		console.log('ding ding ding! You rendered!', this.x, this.y);
	}
}
