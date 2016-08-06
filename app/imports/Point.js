/*

this.x = x; // float coordinate
this.y = y; // float coordinate
this.previousNode = undefined; // another node
this.nextNode = undefined; // another node
this.previousChord = undefined; // attached "left"
this.nextChord = undefined; // attached "right"
this.normal = undefined; // angle between prev & next
this.angle = undefined; // in radians modded to Tau
this.curvature = undefined; // "k" in mathematics

*/

export default class Point{

  constructor(x,y){
    this.x = x; // float coordinate
    this.y = y; // float coordinate
    // this.previousNode = undefined; // another node
    // this.nextNode = undefined; // another node
    // this.previousChord = undefined; // attached "left"
    // this.nextChord = undefined; // attached "right"
    // this.normal = undefined; // angle between prev & next
    // this.anglePrev = undefined; // in radians modded to Tau
    // this.angleNext = undefined; // in radians modded to Tau
    // this.curvature = undefined; // "k" in mathematics
  }

  setPrev(otherNode, otherChord){
    this.previousNode = otherNode;
    this.previousChord = otherChord;
    otherNode.nextNode = this;
    this.setNormal();
  }

  setNext(otherNode, otherChord){
    this.nextNode = otherNode;
    this.nextChord = otherChord;
    otherNode.previousNode = this;
    this.setNormal();
  }

  setXY(x=this.x,y=this.y){
    this.x = x;
    this.y = y;
    this.setNormal();
  }

  translate(x=0,y=0){
      this.x += x;
      this.y += y;
  }

  setNormal(){
    if(this.previousNode !== undefined && this.nextNode !== undefined){
      this.normal = this.previousChord.angle + this.nextChord.angle / 2;
    }
  }

}
