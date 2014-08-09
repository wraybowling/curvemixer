(function(){
//console.groupCollapsed('tests');
console.groupCollapsed('tests');

//var stage = document.createElementNS('http://www.w3.org/1999/xlink', 'svg');
//var gui = document.createElementNS('http://www.w3.org/1999/xlink', 'svg');

var container = document.querySelector('.curvemixer');
var stage = container.querySelector('.stage');
var gui = container.querySelector('.gui');

var curvemixer = new CURVEMIXER(container, stage,gui);

var p = new POINT(100,100);
console.log('point', p);

var h = new HANDLE(200,100,'free');
var h2 = new HANDLE(300,100);
console.log('handles',h,h2);

var s = new SEGMENT('linear', p);
console.log('segment',s);

var m = new POINT(800,800);
var c = new CHAIN(m);
c.addSegment(s);
console.log('chain',c);

var o = new OBJECT(curvemixer);
console.log('object',o);

var g1 = new GROUP(curvemixer);
var g2 = new GROUP(curvemixer);
console.log('two groups',g1,g2);

console.groupEnd();

}());