class Node{
  var x = undefined, // float coordinate
      y = undefined, // float coordinate
      previousNode = undefined, // another node
      nextNode = undefined, // another node
      previousChord = undefined, // attached "left"
      nextChord = undefined, // attached "right"
      normal = undefined, // angle between prev & next
      angle = undefined, // in radians modded to Tau
      curvature = undefined; // "k" in mathematics

  constructor(x,y){
    this.x = x;
    this.y = y;
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

  setXY(x,y){
    this.x = x;
    this.y = y;
    this.setNormal();
  }

  setNormal(){
    if(this.previousNode !== undefined && this.nextNode !== undefined){
      this.normal = this.previousChord.angle + this.nextChord.angle / 2;
    }
  }
}
