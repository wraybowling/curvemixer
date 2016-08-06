/* For a curve X(t), the absolute value of curvature is K(t) = Length(Cross(X'(t),X"(t)))/pow(Length(X'(t)),3) <= Length(X'(t))*Length(X"(t))/pow(Length(X'(t)),3) = Length(X"(t))/pow(Length(X'(t)),2) <= A/B^2 where A = max_{t in [0,1]} Length(X"(t)) B = min_{t in [0,1]} Length(X'(t)) For a quadratic curve X(t), X"(t) is a constant vector, so A is easily computed. X'(t) is a vector that is linear in t. pow(Length(X'(t)),2) is quadratic in t. It is easy enough to compute the t for which the quadratic polynomial is a minimum, then use that to compute B. For a cubic curve, X"(t) is linear in t and its squared length is quadratic. Computing a maximum length in t is straightforward. X'(t) is quadratic in t, so its squared length is quartic. The closed expressions for the roots (or a numerical method if you so choose) may be used to compute the minimum squared length. In comparison, the polynomial from setting curvature derivative to zero has degree 3 when X(t) is quadratic and degree 9 when X(t) is cubic. Alternatively, you can go ahead and subdivide. At each subdivision step, apply the subdivision just to see how close the polyline of approximation differs from the true curve. If the difference is large enough, accept the subdivision. If not reject it. - See more at: http://compgroups.net/comp.graphics.algorithms/maximum-curvature-of-bezier-curve/2048992#sthash.rUHpIK9s.dpuf
*/

export class Casteljau1 extends Chain{
	constructor(points){
	}

	getCurvature(t){

	}
}
