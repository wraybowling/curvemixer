/*
  chains are just arrays of segments that share the same type
  but they include extra parameters
  and can be extended to allow for more curve algorithms
*/

export default class Chain {
  constructor(segments = [], options = {}) {
    this.segments = segments;
    this.closed = options.closed || false;
  }
}
