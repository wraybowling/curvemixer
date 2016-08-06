// http://blog.avangardo.com/2010/10/c-implementation-of-bezier-curvature-calculation/

class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  normal() {
    // FIXME: don't create new vector object. it's slower.
    return new Vector(-this.y, this.x);
    // return new Vector(this.y,-this.x);
  }

  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    const l = this.length();
    return new Vector(this.x / l, this.y / l);
  }

  pow(e) {
    return new Vector(Math.pow(this.x, e), Math.pow(this.y, e));
  }

  scale(n) {
    return new Vector(this.x * n, this.y * n);
  }

  add(v2) {
    return new Vector(this.x + v2.x, this.y + v2.y);
  }

  subtract(v2) {
    return new Vector(this.x - v2.x, this.y - v2.y);
  }

  divide(n) {
    return new Vector(this.x / n, this.y / n);
  }

  abs() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  crossProduct(v2) {
    return new Vector();
  }
}

class CubicCasteljau {
  constructor(x1, y1, x2, y2, x3, y3, x4, y4) {
    this.p = [];
    this.p.push(new Point(x1, y1));
    this.p.push(new Point(x2, y2));
    this.p.push(new Point(x3, y3));
    this.p.push(new Point(x4, y4));
  }

  getPoint(t) {
    const p = this.p;
    const cx = 3 * (p[1].x - p[0].x);
    const bx = 3 * (p[2].x - p[1].x) - cx;
    const ax = p[3].x - p[0].x - cx - bx;
    const cy = 3 * (p[1].y - p[0].y);
    const by = 3 * (p[2].y - p[1].y) - cy;
    const ay = p[3].y - p[0].y - cy - by;
    const tSquared = t * t;
    const tCubed = tSquared * t;
    const resultX = (ax * tCubed) + (bx * tSquared) + (cx * t) + p[0].x;
    const resultY = (ay * tCubed) + (by * tSquared) + (cy * t) + p[0].y;
    return new Point(resultX, resultY);
  }

  getDerivative1(t) {
    const tSquared = t * t;
    const s0 = -3 + 6 * t - 3 * tSquared;
    const s1 = 3 - 12 * t + 9 * tSquared;
    const s2 = 6 * t - 9 * tSquared;
    const s3 = 3 * tSquared;
    const p = this.p;
    const resultX = p[0].x * s0 + p[1].x * s1 + p[2].x * s2 + p[3].x * s3;
    const resultY = p[0].y * s0 + p[1].y * s1 + p[2].y * s2 + p[3].y * s3;
    return new Vector(resultX, resultY);
  }

  getDerivative2(t) {
    const s0 = 6 - 6 * t;
    const s1 = -12 + 18 * t;
    const s2 = 6 - 18 * t;
    const s3 = 6 * t;
    const p = this.p;
    const resultX = p[0].x * s0 + p[1].x * s1 + p[2].x * s2 + p[3].x * s3;
    const resultY = p[0].y * s0 + p[1].y * s1 + p[2].y * s2 + p[3].y * s3;
    return new Vector(resultX, resultY);
  }

  getCurvatureRadius(t) {
    const d1 = this.getDerivative1(t);
    const d2 = this.getDerivative2(t);
    const r1 = Math.sqrt(Math.pow(d1.x * d1.x + d1.y * d1.y, 3));
    const r2 = Math.abs(d1.x * d2.y - d2.x * d1.y);
    return r1 / r2;
  }
}

// make some stuff
const q = new CubicCasteljau(10, 20, 40, 10, 80, 80, 290, 90);
let t = 0.2;
const tEl = document.getElementById('t');
const redraw = tEl.oninput = () => {
  t = tEl.value;

  const p = q.getPoint(t);
  const pEl = document.getElementById('point');
  pEl.setAttributeNS(null, 'cx', p.x);
  pEl.setAttributeNS(null, 'cy', p.y);

  const k = q.getCurvatureRadius(t);

  // FIXME
  const vEl = document.getElementById('v');
  const v = q.getDerivative1(t);
  const a = q.getDerivative2(t);
  const at = v.pow(2).divide(k);
  const ac = a.subtract(at);
  vEl.setAttributeNS(null, 'x1', p.x);
  vEl.setAttributeNS(null, 'y1', p.y);
  vEl.setAttributeNS(null, 'x2', p.x + ac.x);
  vEl.setAttributeNS(null, 'y2', p.y + ac.y);

  const kp = q.getDerivative1(t)
    .normal()
    .normalize()
    .scale(k);
  const kEl = document.getElementById('k');
  kEl.setAttributeNS(null, 'r', k);
  kEl.setAttributeNS(null, 'cx', p.x + kp.x);
  kEl.setAttributeNS(null, 'cy', p.y + kp.y);
};
redraw();
