export class Point{
    constructor(x=0,y=0){
	   this.x = x;
	   this.y = y;
	   this.selected = false;
   }
}

Point.prototype.set = function(x=this.x,y=this.y){
	this.x = x;
	this.y = y;
};

Point.prototype.translate = function(x=0,y=0){
    this.x += x;
    this.y += y;
};