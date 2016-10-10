import Point from '/imports/Point.js';
import Segment from '/imports/Segment.js';
import Chain from '/imports/Chain.js';
import Path from '/imports/Path.js';

console.log("Let's make three points");
let n1 = new Point(500,500);
let n2 = new Point(600,550);
let n3 = new Point(400,550);
console.log('points',n1,n2,n3);

let points = [n1,n2,n3];
console.log('put those points into an array', points);

var s1 = new Segment(n1,n2,'linear');
var s2 = new Segment(n2,n3,'linear');
var s3 = new Segment(n3,n1,'linear');
var segments = [s1,s2,s3];
console.log('segments',s1,s2,s3);

var c = new Chain(segments);
console.log('chain',c);
var chains = [c];

var p = new Path(20,20,chains);
console.log('path',p);

p.render();
