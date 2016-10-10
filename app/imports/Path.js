import {Element} from '/imports/Element.js';
import XML from '/imports/XML.js';

export default class Path extends Element{
	constructor(x,y,chains){
		super(x,y);
		this.documentObject = new XML('path');
		this.chains = chains;
		this.pathData = [];
	}

	getPathData(){
		console.log('getting data', this.chains );
		for(let i=0; i<this.chains.length; i++){
		  for(j=0; j<this.chains[i].segments.length; j++){
		    this.pathData.push('L');
		    this.pathData.push(this.chains[i].segments[j].endNode.x);
		    this.pathData.push(this.chains[i].segments[j].endNode.y);
		  }
		}
	}

	render(){
		// this.documentObject.setAttributeNS(null,'d',this.getPathData().join(' '));
		console.log('stage',this.stage);
		console.log('fixme. stage should not be null');
		//
		// console.log('ding ding ding! You rendered!', this.x, this.y);
		// console.log(this.pathData);
	}
}

const q = function () {};

q();
