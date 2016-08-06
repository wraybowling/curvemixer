function arg(z){
  return Math.atan2(z.imag, z.real);
}

function direc(angle_degrees){
  // Given an angle in degrees, returns a complex with modulo 1 and the given phase
  var phi = angle_degrees / 180 * Math.PI; // convert to radians
  return direc_rad(phi);
}

function direc_rad(angle_radians){
  // Given an angle in degrees, returns a complex with modulo 1 and the given phase
  return Math.complex(Math.cos(angle_radians), Math.sin(angle_radians));
}

function Point(){
  this.z = Math.complex(0,0);  // point coordinates
  this.alpha = 1;  // tension at point
  this.beta = 1;
  this.theta = 0;  // angle at which the path leaves
  this.phi = 0;  // angle at which the path enters
  this.xi = 0;    // angle turned by the polyline at this point
  this.v_left = complex(0,0); // bezier
  this.u_right = complex(0,0); // bezier
  this.d_ant = 0;
  this.d_post = 0;
}

Point.prototype.__init__ = function(z, alpha, beta, v, u) {
  // constructor
  if( typeof(z) == Math.complex ){
    this.z = z;
  }else{
    this.z = complex(z[0],z[1]);
  }
  this.alpha = alpha;
  this.beta = beta;
  this.v_left = v;
  this.u_right = u;
  this.d_ant  = 0;
  this.d_post = 0;
  this.xi   = 0;
};

function Path(){
  this.points = [];
  this.cyclic = true;
  this.curl_begin = 1;  //if not, curl parameter at endpoints
  this.curl_end = 1;
}

Path.prototype.__init__ = function(points, tension, cyclic, curl_begin, curl_end) {
  for (var i = 0; i < points.length; i++) {
    var new_point = new Point(1.0/tension, 1.0/tension);
    this.points.push(new_point);
  }
  this.cyclic = cyclic;
  this.curl_begin = curl_begin;
  this.curl_end = curl_end;
};

Path.prototype.range = function() {
  // Returns the range of the indexes of the points to be solved.
  // This range is the whole length of p for cyclic paths, but excludes
  // the first and last points for non-cyclic paths
  if(this.cyclic){
    return Math.range(this.points.length);
  }else{
    return Math.range(1, this.points.length-1);
  }
};

Path.prototype.append = function(point) {
  this.points.push(point);
};

Path.prototype.__len__ = function() {
  return this.points.length;
};

Path.prototype.__getitem__ = function(i) {
  // gets point [i] in the list
  // assuming that the list is circular
  i %= this.points.length;
  return this.points[i];
};

function f(theta, phi){
  var n = 2+sqrt(2)*(sin(theta)-sin(phi)/16)*(sin(phi)-sin(theta)/16)*(cos(theta)-cos(phi));
  var m = 3*(1 + 0.5*(sqrt(5)-1)*cos(theta) + 0.5*(3-sqrt(5))*cos(phi));
  return n/m;
}

function control_points(z0, z1, theta, phi, alpha, beta){
    // Given two points in a path, and the angles of departure and arrival
    // at each one, this function finds the appropiate control points of the
    // Bezier's curve, using John Hobby's algorithm
    var i = Math.complex(0,1);
    var u = z0 + Math.exp(i*theta)*(z1-z0)*f(theta, phi)*alpha;
    var v = z1 - Math.exp(-i*phi)*(z1-z0)*f(phi, theta)*beta;
    return [u,v];
}



////////////////////


function hobby(points,options){
  points = points || [];
  tension = options.tension || 1;
  offset = options.offset || [0,0];
  cycle = options.cycle || true;
  debug = options.debug || false;

  // set 3D default
  offset.z = offset.z || 0;

  // if closed shape, re-add the first point
  if(cycle){
    points.push(points[0]);
  }

  // arrays to do maths on
  z = []; // points
  w = []; // unit vectors of direction of curve through each point
  tin = []; // tension of curve in to point
  tout = []; // tension of curve out from point

  for (var i = 0; i < points.length; i++) {
    console.log(points[i]);

    w[i] = [undefined, undefined, undefined];
    tin[i] = tension;
    tout[i] = tension;

    // if line is only two points, it's just a line
    if(points.length == 2){
      z[i] = offset + [points[i][0],0];
    }else{
      z[i] = [offset[0] + points[i][0], offset[1] + points[i][0]];
    }


  }

  casteljau([P1,P2,P3,P4]);
}
