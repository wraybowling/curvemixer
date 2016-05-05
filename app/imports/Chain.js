/*
things that define a chain....

*/

class Chain{

  constructor(){
    if (node.previous) node.previous.next = node;
    if (node.next) node.next.previous = node;
  }

}
