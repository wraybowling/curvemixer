/*
  things that define a chain....

*/

export class Chain{
  constructor(segments = [], options = {}){
    this.segments = segments;
    this.closed = options.closed || false;
  }
}
