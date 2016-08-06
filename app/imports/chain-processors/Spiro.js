/*

Logic that lives outside of the Spiro class will
conditionally avoid its use, but there will be no
if-then logic inside of it to prevent its functionality
from operating. Chielfy, Spiro can be used with no
start/end angle so long as there are 4 or more anchors.

If there are 2–3 anchors, then at least 1 angle
(and optionally curvature) MUST be defined otherwise
the result would just come out as an arc/circle or straight line

*/


export class Spiro extends Chain{
  var startAngle = undefined,
      startCurvature = undefined,
      endAngle = undefined,
      endCurvature = undefined,
      looping = undefined;

  constructor(chain, looping){
    super();

    this.looping = looping;

    var start = chain[0],
        end = chain[chain.length-1];

    if(start.manualAngle){
      // use the angle from the start of the chain
      if(start.manualCurvature){
        // use the curvature start of this chain
      }
    }
    if(end.manualAngle){
      // use the angle from the end of the chain
      if(end.manualCurvature){
        // use the curvature end of this chain
      }
    }
  }

  getPathData(){
    // return the path data
    return 'spiro -> bezier result';
  }

  allTheOtherFunctions(){
    // things that actually do stuff
  }
}
