DEBUG = false;

// -- generic band-diagonal matrix solver, adapted from numerical recipes

function bandec(mat, n, m) {
	console.group('bandec');
	for (var i = 0; i < m; i++) {
	var mat_i = mat[i];
	for (var j = 0; j <= i + m; j++)
		mat_i.a[j] = mat_i.a[j + m - i];
	for (; j <= m + m; j++)
		mat_i.a[j] = 0;
	}
	var l = m;
	for (var k = 0; k < n; k++) {
	var mat_k = mat[k];
	mat_k.al = [];
	if (l < n) l++;
	var pivot_val = mat_k.a[0];
	if (Math.abs(pivot_val) < 1e-12) pivot_val = 1e-12;
	for (i = k + 1; i < l; i++) {
		mat_i = mat[i];
		var x = mat_i.a[0] / pivot_val;
		mat_k.al[i - k - 1] = x;
		for (j = 1; j <= m + m; j++)
		mat_i.a[j - 1] = mat_i.a[j] - x * mat_k.a[j];
		mat_i.a[m + m] = 0;
	}
	}
	console.groupEnd();
}

function banbks(mat, v, n, m) {
	console.group('banbks');
	var l = m;
	for (var k = 0; k < n; k++) {
	var mat_k = mat[k];
	if (l < n) l++;
	for (var i = k + 1; i < l; i++)
		v[i] -= mat_k.al[i - k - 1] * v[k];
	}
	l = 0;
	for (i = n - 1; i >= 0; i--) {
	var mat_i = mat[i];
	var x = v[i];
	for (k = 1; k <= l; k++)
		x -= mat_i.a[k] * v[k + i];
	v[i] = x / mat_i.a[0];
	if (l < m + m) l++;
	}
	console.groupEnd();
}

// -- actual spiro code

res = [0, 0];

function integ_euler_10(k0, k1) {
	console.group('integrate euler 10');
	var t1_1 = k0;
	var t1_2 = .5 * k1;
	var t2_2 = t1_1 * t1_1;
	var t2_3 = 2 * (t1_1 * t1_2);
	var t2_4 = t1_2 * t1_2;
	var t3_4 = t2_2 * t1_2 + t2_3 * t1_1;
	var t3_6 = t2_4 * t1_2;
	var t4_4 = t2_2 * t2_2;
	var t4_5 = 2 * (t2_2 * t2_3);
	var t4_6 = 2 * (t2_2 * t2_4) + t2_3 * t2_3;
	var t4_7 = 2 * (t2_3 * t2_4);
	var t4_8 = t2_4 * t2_4;
	var t5_6 = t4_4 * t1_2 + t4_5 * t1_1;
	var t5_8 = t4_6 * t1_2 + t4_7 * t1_1;
	var t6_6 = t4_4 * t2_2;
	var t6_7 = t4_4 * t2_3 + t4_5 * t2_2;
	var t6_8 = t4_4 * t2_4 + t4_5 * t2_3 + t4_6 * t2_2;
	var t7_8 = t6_6 * t1_2 + t6_7 * t1_1;
	var t8_8 = t6_6 * t2_2;
	var u = 1;
	u -= (1./24) * t2_2 + (1./160) * t2_4;
	u += (1./1920) * t4_4 + (1./10752) * t4_6 + (1./55296) * t4_8;
	u -= (1./322560) * t6_6 + (1./1658880) * t6_8;
	u += (1./92897280) * t8_8;
	var v = (1./12) * t1_2;
	v -= (1./480) * t3_4 + (1./2688) * t3_6;
	v += (1./53760) * t5_6 + (1./276480) * t5_8;
	v -= (1./11612160) * t7_8;
	res[0] = u;
	res[1] = v;
	console.log('res',res);
	console.groupEnd();
	return res;
}

function integ_spiro_12(k0, k1, k2, k3) {
	console.group('integrate spiro 12');
	var t1_1 = k0;
	var t1_2 = .5 * k1;
	var t1_3 = (1./6) * k2;
	var t1_4 = (1./24) * k3;
	var t2_2 = t1_1 * t1_1;
	var t2_3 = 2 * (t1_1 * t1_2);
	var t2_4 = 2 * (t1_1 * t1_3) + t1_2 * t1_2;
	var t2_5 = 2 * (t1_1 * t1_4 + t1_2 * t1_3);
	var t2_6 = 2 * (t1_2 * t1_4) + t1_3 * t1_3;
	var t2_7 = 2 * (t1_3 * t1_4);
	var t2_8 = t1_4 * t1_4;
	var t3_4 = t2_2 * t1_2 + t2_3 * t1_1;
	var t3_6 = t2_2 * t1_4 + t2_3 * t1_3 + t2_4 * t1_2 + t2_5 * t1_1;
	var t3_8 = t2_4 * t1_4 + t2_5 * t1_3 + t2_6 * t1_2 + t2_7 * t1_1;
	var t3_10 = t2_6 * t1_4 + t2_7 * t1_3 + t2_8 * t1_2;
	var t4_4 = t2_2 * t2_2;
	var t4_5 = 2 * (t2_2 * t2_3);
	var t4_6 = 2 * (t2_2 * t2_4) + t2_3 * t2_3;
	var t4_7 = 2 * (t2_2 * t2_5 + t2_3 * t2_4);
	var t4_8 = 2 * (t2_2 * t2_6 + t2_3 * t2_5) + t2_4 * t2_4;
	var t4_9 = 2 * (t2_2 * t2_7 + t2_3 * t2_6 + t2_4 * t2_5);
	var t4_10 = 2 * (t2_2 * t2_8 + t2_3 * t2_7 + t2_4 * t2_6) + t2_5 * t2_5;
	var t5_6 = t4_4 * t1_2 + t4_5 * t1_1;
	var t5_8 = t4_4 * t1_4 + t4_5 * t1_3 + t4_6 * t1_2 + t4_7 * t1_1;
	var t5_10 = t4_6 * t1_4 + t4_7 * t1_3 + t4_8 * t1_2 + t4_9 * t1_1;
	var t6_6 = t4_4 * t2_2;
	var t6_7 = t4_4 * t2_3 + t4_5 * t2_2;
	var t6_8 = t4_4 * t2_4 + t4_5 * t2_3 + t4_6 * t2_2;
	var t6_9 = t4_4 * t2_5 + t4_5 * t2_4 + t4_6 * t2_3 + t4_7 * t2_2;
	var t6_10 = t4_4 * t2_6 + t4_5 * t2_5 + t4_6 * t2_4 + t4_7 * t2_3 + t4_8 * t2_2;
	var t7_8 = t6_6 * t1_2 + t6_7 * t1_1;
	var t7_10 = t6_6 * t1_4 + t6_7 * t1_3 + t6_8 * t1_2 + t6_9 * t1_1;
	var t8_8 = t6_6 * t2_2;
	var t8_9 = t6_6 * t2_3 + t6_7 * t2_2;
	var t8_10 = t6_6 * t2_4 + t6_7 * t2_3 + t6_8 * t2_2;
	var t9_10 = t8_8 * t1_2 + t8_9 * t1_1;
	var t10_10 = t8_8 * t2_2;
	var u = 1;
	u -= (1./24) * t2_2 + (1./160) * t2_4 + (1./896) * t2_6 + (1./4608) * t2_8;
	u += (1./1920) * t4_4 + (1./10752) * t4_6 + (1./55296) * t4_8 + (1./270336) * t4_10;
	u -= (1./322560) * t6_6 + (1./1658880) * t6_8 + (1./8110080) * t6_10;
	u += (1./92897280) * t8_8 + (1./454164480) * t8_10;
	u -= 2.4464949595157930e-11 * t10_10;
	var v = (1./12) * t1_2 + (1./80) * t1_4;
	v -= (1./480) * t3_4 + (1./2688) * t3_6 + (1./13824) * t3_8 + (1./67584) * t3_10;
	v += (1./53760) * t5_6 + (1./276480) * t5_8 + (1./1351680) * t5_10;
	v -= (1./11612160) * t7_8 + (1./56770560) * t7_10;
	v += 2.4464949595157932e-10 * t9_10;
	res[0] = u;
	res[1] = v;
	console.groupEnd();
	return res;
}

function integ_spiro_12n(k0, k1, k2, k3, n) {
	console.group('integrate spiro 12 n');
	var th1 = k0;
	var th2 = .5 * k1;
	var th3 = (1./6) * k2;
	var th4 = (1./24) * k3;
	var x, y;
	var ds = 1. / n;
	var ds2 = ds * ds;
	var ds3 = ds2 * ds;
	var s = .5 * ds - .5;

	k0 *= ds;
	k1 *= ds;
	k2 *= ds;
	k3 *= ds;

	x = 0;
	y = 0;

	for (var i = 0; i < n; i++) {
	var km0 = (((1./6) * k3 * s + .5 * k2) * s + k1) * s + k0;
	var km1 = ((.5 * k3 * s + k2) * s + k1) * ds;
	var km2 = (k3 * s + k2) * ds2;
	var km3 = k3 * ds3;

	var uv = integ_spiro_12(km0, km1, km2, km3);
	var u = uv[0];
	var v = uv[1];

	var th = (((th4 * s + th3) * s + th2) * s + th1) * s;
	var cth = Math.cos(th);
	var sth = Math.sin(th);

	x += cth * u - sth * v;
	y += cth * v + sth * u;
	s += ds;
	}
	console.groupEnd();
	return [x * ds, y * ds];
}

// technique and coefficients adapted from cephes library
function fresnel(x, res) {
	console.group('fresnel');
	var x2 = x * x;
	if (x2 < 2.5625) {
		console.log('x^2 > 2.5625');
		var t = x2 * x2;
		res[0] = x * x2 * (((((-2.99181919401019853726E3 * t +
				 7.08840045257738576863E5) * t +
				-6.29741486205862506537E7) * t +
				   2.54890880573376359104E9) * t +
				  -4.42979518059697779103E10) * t +
				 3.18016297876567817986E11) /
		((((((t + 2.81376268889994315696E2) * t +
		 4.55847810806532581675E4) * t +
		5.17343888770096400730E6) * t +
		   4.19320245898111231129E8) * t +
		  2.24411795645340920940E10) * t + 6.07366389490084639049E11);
		res[1] = x * (((((-4.98843114573573548651E-8 * t +
				9.50428062829859605134E-6) * t +
			   -6.45191435683965050962E-4) * t +
			  1.88843319396703850064E-2) * t +
			 -2.05525900955013891793E-1) * t +
			9.99999999999999998822E-1) /
		((((((3.99982968972495980367E-12 * t +
		  9.15439215774657478799E-10) * t +
		 1.25001862479598821474E-7) * t +
		1.22262789024179030997E-5) * t +
		   8.68029542941784300606E-4) * t +
		  4.12142090722199792936E-2) * t + 1.00000000000000000118E0);
	} else {
		console.log('x^2 < 2.5625');
		var t = 1.0 / (Math.PI * x2);
		var u = t * t;
		var f = 1.0 - u * (((((((((4.21543555043677546506E-1 * u +
				   1.43407919780758885261E-1) * u +
				  1.15220955073585758835E-2) * u +
				 3.45017939782574027900E-4) * u +
				4.63613749287867322088E-6) * u +
				   3.05568983790257605827E-8) * u +
				  1.02304514164907233465E-10) * u +
				 1.72010743268161828879E-13) * u +
				1.34283276233062758925E-16) * u +
			   3.76329711269987889006E-20) /
		((((((((((u + 7.51586398353378947175E-1) * u +
			 1.16888925859191382142E-1) * u +
			6.44051526508858611005E-3) * u +
		   1.55934409164153020873E-4) * u +
		  1.84627567348930545870E-6) * u +
		 1.12699224763999035261E-8) * u +
		3.60140029589371370404E-11) * u +
		   5.88754533621578410010E-14) * u +
		  4.52001434074129701496E-17) * u + 1.25443237090011264384E-20);
		var g = t * ((((((((((5.04442073643383265887E-1 * u +
				  1.97102833525523411709E-1) * u +
				 1.87648584092575249293E-2) * u +
				6.84079380915393090172E-4) * u +
			   1.15138826111884280931E-5) * u +
			  9.82852443688422223854E-8) * u +
			 4.45344415861750144738E-10) * u +
			1.08268041139020870318E-12) * u +
			   1.37555460633261799868E-15) * u +
			  8.36354435630677421531E-19) * u +
			 1.86958710162783235106E-22) /
		(((((((((((u + 1.47495759925128324529E0) * u +
			  3.37748989120019970451E-1) * u +
			 2.53603741420338795122E-2) * u +
			8.14679107184306179049E-4) * u +
		   1.27545075667729118702E-5) * u +
		  1.04314589657571990585E-7) * u +
		 4.60680728146520428211E-10) * u +
		1.10273215066240270757E-12) * u +
		   1.38796531259578871258E-15) * u +
		  8.39158816283118707363E-19) * u + 1.86958710162783236342E-22);
		t = Math.PI * .5 * x2;
		var c = Math.cos(t);
	var s = Math.sin(t);
		t = Math.PI * x;
	var p = x < 0 ? -0.5 : 0.5;
		res[1] = p + (f * s - g * c) / t;
		res[0] = p - (f * c + g * s) / t;
	}
	console.groupEnd();
}

var yx0 = [0, 0];
var yx1 = [0, 0];

// direct evaluation by fresnel integrals
function integ_euler(k0, k1) {
	console.group('integrate euler');
	var ak1 = Math.abs(k1);
	if (ak1 < 5e-8) {
	res[0] = (k0 == 0) ? 1 : Math.sin(k0 * .5) / (k0 * .5);
	res[1] = 0;
	return res;
	}
	var sqrk1 = Math.sqrt(ak1 * Math.PI);
	var t0 = (k0 - .5 * ak1) / sqrk1;
	var t1 = (k0 + .5 * ak1) / sqrk1;
	fresnel(t0, yx0);
	fresnel(t1, yx1);
	var thm = .5 * k0 * k0 / ak1;
	var s = Math.sin(thm) / (t1 - t0);
	var c = Math.cos(thm) / (t1 - t0);
	res[0] = (yx1[1] - yx0[1]) * c + (yx1[0] - yx0[0]) * s;
	var v = (yx1[0] - yx0[0]) * c - (yx1[1] - yx0[1]) * s;
	res[1] = k1 < 0 ? -v : v;
	console.log('res',res);
	console.groupEnd();
	return res;
}

// This function is tuned to give an accuracy within 1e-9.
function integ_spiro(k0, k1, k2, k3) {
	console.group('integrate spiro');
	if (k2 == 0 && k3 == 0) {
		// Euler spiral
		var est_err_raw = .2 * k0 * k0 + Math.abs(k1);
		if (est_err_raw < 1) {
			console.log('estimated error < 1');
			if (est_err_raw < .45){
				console.log('error < 0.45');
				var result = integ_euler_10(k0, k1);
				console.groupEnd();
				return result;
			}else{
				console.log('error > 0.45');
				var result = integ_spiro_12(k0, k1, k2, k3);
				console.groupEnd();
				return result;
			}
		}
		console.log('error > 1');
		var result = integ_euler(k0, k1);
		console.groupEnd();
		return result;
	}
	console.log('either k2 or k3 is not equal to 0.')
	var result = integ_spiro_12n(k0, k1, k2, k3, 4);
	console.groupEnd();
	return result;
}

var alternating_stroke = true;

function seg_to_bez(ctx, ks, x0, y0, x1, y1) {
	console.group('seg_to_bez');
	console.log('ks',ks);
	console.log('coordinates', x0, y0, x1, y1);
	var bend = Math.abs(ks[0]) + Math.abs(.5 * ks[1]) + Math.abs(.125 * ks[2]) + Math.abs((1./48) * ks[3]);
	console.log('bend',bend);
	if (bend < 1e-8) {
		console.log('bend < 0.00000001');
		ctx.lineTo(x1, y1);
	} else {
		var seg_ch = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var seg_th = Math.atan2(y1 - y0, x1 - x0);

		var xy = integ_spiro(ks[0], ks[1], ks[2], ks[3]);
		var ch = Math.sqrt(xy[0] * xy[0] + xy[1] * xy[1]);
		var th = Math.atan2(xy[1], xy[0]);
		var scale = seg_ch / ch;
		var rot = seg_th - th;
		if (bend < 1) {
			console.log('bend < 1');
			var th_even = (1./384) * ks[3] + (1./8) * ks[1] + rot;
			var th_odd = (1./48) * ks[2] + .5 * ks[0];
			var scale3 = scale * (1./3);
			var ul = scale3 * Math.cos(th_even - th_odd);
			var vl = scale3 * Math.sin(th_even - th_odd);
			var ur = scale3 * Math.cos(th_even + th_odd);
			var vr = scale3 * Math.sin(th_even + th_odd);
			ctx.bezierCurveTo(x0 + ul, y0 + vl, x1 - ur, y1 - vr, x1, y1);
		} else {
			console.log('bend > 1 (subdivide)');
			/* subdivide */
			var ksub =
			[.5 * ks[0] - .125 * ks[1] + (1./64) * ks[2] - (1./768) * ks[3],
			 .25 * ks[1] - (1./16) * ks[2] + (1./128) * ks[3],
			 .125 * ks[2] - (1./32) * ks[3],
			 (1./16) * ks[3]
			 ];
			var thsub = rot - .25 * ks[0] + (1./32) * ks[1] - (1./384) * ks[2] + (1./6144) * ks[3];
			var cth = .5 * scale * Math.cos(thsub);
			var sth = .5 * scale * Math.sin(thsub);
			var xysub = integ_spiro(ksub[0], ksub[1], ksub[2], ksub[3]);
			var xmid = x0 + cth * xysub[0] - sth * xysub[1];
			var ymid = y0 + cth * xysub[1] + sth * xysub[0];
			seg_to_bez(ctx, ksub, x0, y0, xmid, ymid);
			ksub[0] += .25 * ks[1] + (1./384) * ks[3];
			ksub[1] += .125 * ks[2];
			ksub[2] += (1./16) * ks[3];
			seg_to_bez(ctx, ksub, xmid, ymid, x1, y1);
		}
	}
	console.groupEnd();
}

function fit_euler(th0, th1) {
	console.group('fit euler');
	//bookmark
	var k1_old = 0;
	var error_old = th1 - th0;
	var k0 = th0 + th1;
	while (k0 > 2 * Math.PI)
		k0 -= 4 * Math.PI;
	while (k0 < -2 * Math.PI)
		k0 += 4 * Math.PI;
	var k1 = 6 * (1 - Math.pow((.5 / Math.PI) * k0, 3)) * error_old;
	for (var i = 0; i < 10; i++) {
		var xy = integ_spiro(k0, k1, 0, 0);
		var error = (th1 - th0) - (.25 * k1 - 2 * Math.atan2(xy[1], xy[0]));
		if (Math.abs(error) < 1e-9) break;
		var new_k1 = k1 + (k1_old - k1) * error / (error - error_old);
		k1_old = k1;
		error_old = error;
		k1 = new_k1;
	}
	if (i == 10)
		throw "fit_euler diverges at " + th0 + ", " + th1;
	var chord = Math.sqrt(xy[0] * xy[0] + xy[1] * xy[1]);
	console.groupEnd();
	return {ks: [k0, k1], chord: chord};
}

function fit_euler_ks(th0, th1, chord) {
	console.group('fit euler ks', th0, th1, chord);
	var p = fit_euler(th0, th1);
	var sc = p.chord / chord;
	p.k0 = (p.ks[0] - .5 * p.ks[1]) * sc;
	p.k1 = (p.ks[0] + .5 * p.ks[1]) * sc;
	console.groupEnd();
	return p;
}

function get_ths_straight() {
	console.log('get ths straight');
	return [0, 0];
}

function get_ths_left() {
	console.log('get ths left');
	return [this.init_th1 + this.right.dth, this.init_th1 + this.right.dth];
}

function get_ths_right() {
	console.log('get ths right');
	return [this.init_th0 - this.left.dth, this.init_th0 - this.left.dth];
}

function get_ths_g2() {
	console.log('get ths g2');
	return [this.init_th0 - this.left.dth, this.init_th1 + this.right.dth];
}

function Spline(segs, nodes) {
	console.group('Spline');
	console.log('segments', segs);
	console.log('nodes', nodes);
	this.segs = segs;
	this.nodes = nodes;
	console.groupEnd();
}

Spline.prototype.show_in_shell = function () {
	showobj(this.segs);
	showobj(this.nodes);
}

function setup_solver(path) {
	console.group('set up solver');
	var segs = new Array;
	var nodes = new Array;

	for (var i = 0; i < path.length - 1; i++) {
	var seg = {};
	var dx = path[i + 1][0] - path[i][0];
	var dy = path[i + 1][1] - path[i][1];
	seg.th = Math.atan2(dy, dx);
	seg.chord = Math.sqrt(dx * dx + dy * dy);
	segs[i] = seg;
	}
	for (i = 0; i < path.length; i++) {
	var node = {};
	node.xy = path[i];
	node.dth = 0;
	if (i > 0) {
		node.left = segs[i - 1];
	}
	if (i < path.length - 1) {
		node.right = segs[i];
	}
	if (node.left) node.left.right = node;
	if (node.right) node.right.left = node;
	if (node.left && node.right) {
		var th = node.right.th - node.left.th;
		if (th > Math.PI) th -= 2 * Math.PI;
		if (th < -Math.PI) th += 2 * Math.PI;
		node.th = th;
		var chord_sum = node.left.chord + node.right.chord;
		node.left.init_th1 = th * node.left.chord / chord_sum;
		node.right.init_th0 = th * node.right.chord / chord_sum;
	}
	nodes[i] = node;
	}
	for (var i = 0; i < segs.length; i++) {
		var seg = segs[i];
		if (seg.init_th0 == undefined) {
			if (seg.init_th1 == undefined) {
			seg.init_th0 = 0;
			seg.init_th1 = 0;
			seg.get_ths = get_ths_straight;
			} else {
			seg.init_th0 = seg.init_th1;
			seg.get_ths = get_ths_left;
			}
		} else {
			if (seg.init_th1 == undefined) {
			seg.init_th1 = seg.init_th0;
			seg.get_ths = get_ths_right;
			} else {
			seg.get_ths = get_ths_g2;
			}
		}
	}
	var result = new Spline(segs, nodes)
	console.trace();
	console.groupEnd();
	return result;
}

function get_jacobian_g2(node) {
	console.group('get jacobian g2');
	var save_dth = node.dth;
	var delta = 1e-6;
	node.dth += delta;

	var ths = node.left.get_ths();
	var lparms = fit_euler_ks(ths[0], ths[1], node.left.chord);

	ths = node.right.get_ths();
	var rparms = fit_euler_ks(ths[0], ths[1], node.right.chord);

	node.dth = save_dth;

	var result = [(lparms.k0 - node.left.params.k0) / delta,
		(rparms.k0 - node.right.params.k0 - lparms.k1 + node.left.params.k1) / delta,
		(-rparms.k1 + node.right.params.k1) / delta];
	console.log('result',result);
	console.groupEnd();
	return result;
}

function refine_euler(spline, step) {
	console.group('refine euler');
	console.log('spline',spline);
	console.log('step',step);
	var maxerr = 0;
	var segs = spline.segs;
	var nodes = spline.nodes;
	for (var i = 0; i < segs.length; i++) {
	var seg = segs[i];
	var ths = seg.get_ths();
	seg.params = fit_euler_ks(ths[0], ths[1], seg.chord);
	}
	var dks = [];
	var mat = [];
	j = 0;
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		if (node.left && node.right) {
			var kerr = node.right.params.k0 - node.left.params.k1;
			dks[j] = kerr;
			if (Math.abs(kerr) > maxerr) maxerr = Math.abs(kerr);
			mat[j] = {a: get_jacobian_g2(node)};
			j++;
		}
	}
	if (mat.length == 0) return 0;
		bandec(mat, mat.length, 1);
		banbks(mat, dks, mat.length, 1);
		j = 0;
		for (i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		if (node.left && node.right) {
			node.dth -= step * dks[j];
			j++;
		}
	}
	console.log(maxerr);
	console.groupEnd();
	return maxerr;
}

// some test framework to be deleted from production code

function eval_error(k0, k1, k2, k3) {
	console.group('eval error');
	console.log('k0, k1, k2, k3',k0, k1, k2, k3);
	if (k1 == undefined) k1 = 0;
	if (k2 == undefined) k2 = 0;
	if (k3 == undefined) k3 = 0;
	var xy = integ_spiro_12n(k0, k1, k2, k3, 256);
	var errs = [0];
	for (var i = 1; i < 5; i++) {
	var my_xy = integ_spiro_12n(k0, k1, k2, k3, i);
	var err = Math.sqrt((my_xy[0] - xy[0]) * (my_xy[0] - xy[0]) + (my_xy[1] - xy[1]) * (my_xy[1] - xy[1]));
		errs.push(err);
		var est_err = 4e-14 * Math.pow(k0, 12) +
		4e-9 * Math.pow(k0, 2) * Math.pow(Math.abs(k1), 5) +
		4e-10 * Math.pow(k1, 6) +
		6e-10 * Math.pow(k2, 4) +
		2e-10 * Math.pow(k3, 3);
	est_err = Math.pow(.08 * Math.abs(k0) + .2 * Math.sqrt(Math.abs(k1)) + .2 * Math.pow(Math.abs(k2), .333333) + .16 * Math.pow(Math.abs(k3), .25), 12);
	est_err = Math.pow(.006 * k0 * k0 + .03 * Math.abs(k1) + .03 * Math.pow(Math.abs(k2), .666667) + .025 * Math.pow(Math.abs(k3), .5), 6);
	est_err *= Math.pow(i, -12);
	console.log(String(i) + ': ' + String(err) + ', est ' + String(est_err));
	}
	console.log('err[1] / err[2] = ' + String(errs[1] / errs[2]) +
	  ', err[2] / err[4] = ' + String(errs[2] / errs[4]));

	var my_xy = integ_spiro(k0, k1, k2, k3);
	err = Math.sqrt((my_xy[0] - xy[0]) * (my_xy[0] - xy[0]) + (my_xy[1] - xy[1]) * (my_xy[1] - xy[1]));
	console.log('adapt err = ' + String(err));

	var my_xy = integ_euler_10(k0, k1);
	err = Math.sqrt((my_xy[0] - xy[0]) * (my_xy[0] - xy[0]) + (my_xy[1] - xy[1]) * (my_xy[1] - xy[1]));
	console.log('euler_10 err = ' + String(err));
	console.groupEnd();
}

function test_random_euler(n) {
	console.warn('testing random euler');
	if (!n) n = 10000;
	for (var i = 0; i < n; i++) {
	k0 = 5 * Math.random();
	k1 = 10 * (Math.random() - .5);
	var xy = integ_spiro_12n(k0, k1, 0, 0, 4);

	var my_xy = integ_euler_10(k0, k1, 0, 0);
	var err = Math.sqrt((my_xy[0] - xy[0]) * (my_xy[0] - xy[0]) + (my_xy[1] - xy[1]) * (my_xy[1] - xy[1]));

	var est_err_raw = .2 * k0 * k0 + Math.abs(k1);
	if (err > 1e-9 && est_err_raw < .45)
		print('euler_10 err = ' + String(err) + ' est_err_raw = ' + String(est_err_raw));
	}
}

function bench_euler_f(k0, k1, fn, f) {
	var n = 10000;
	var xy = integ_spiro_12n(k0, k1, 0, 0, 4);
	var sd = new Date();
	for (var i = 0; i < n; i++) {
	var my_xy = f(k0, k1, 0, 0, 2);
	}
	var elapsed = new Date() - sd;
	var err = Math.sqrt((my_xy[0] - xy[0]) * (my_xy[0] - xy[0]) + (my_xy[1] - xy[1]) * (my_xy[1] - xy[1]));
	print(fn + '(' + String(k0) + ', ' + String(k1) + '): err = ' + String(err) + ', time = ' + String(elapsed * 1000. / n));
}

function bench_euler(k0, k1) {
	bench_euler_f(k0, k1, 'integ_euler_10', integ_euler_10);
	bench_euler_f(k0, k1, 'integ_spiro_12', integ_spiro_12);
	bench_euler_f(k0, k1, 'integ_euler', integ_euler);
	bench_euler_f(k0, k1, 'integ_spiro', integ_spiro);
}

function run_bench(n) {
	if (!n) n = 10;
	for (var i = 0; i < n; i++) {
	console.log('---');
	bench_euler(Math.random(), Math.random());
	}
}

xp = [[10, 100], [50, 20], [100, 120], [150, 100]];
s = setup_solver(xp);

// UI stuff follows

function SpiroUi(canvas) {
	this.canvas = canvas;
	this.path = [];
	this.hit = null;
	var self = this;
	canvas.onmousedown = function(evt) { self.down(evt); };
	canvas.onmousemove = function(evt) { self.move(evt); };
	canvas.onmouseup = function(evt) { self.up(evt); };
}

SpiroUi.prototype.paint = function() {
	console.group('paint');
	var ctx = this.canvas.getContext("2d");
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	step = 1;
	msg = null;
	for (var outer = 0; outer < 3; outer++) {
		var spline = setup_solver(this.path);
		if (outer == 2) break;
		try {
			for (var j = 0; j < 30; j++)
			if (refine_euler(spline, step) < 1e-6) break;
			if (j < 30) break;
		} catch (e) {
			console.error(msg);
		}
			step *= .5;
		}
		var nodes = spline.nodes;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			ctx.beginPath();
			ctx.arc(node.xy[0], node.xy[1], 2, 0, 2 * Math.PI, 0);
			ctx.fill();
		}
		if (nodes.length) {
			switch (outer) {
			case 0: ctx.strokeStyle = "rgb(0, 0, 0)"; break;
			case 1: ctx.strokeStyle = "rgb(64, 0, 0)"; break;
			case 2: ctx.strokeStyle = "rgb(255, 0, 0)"; break;
		}
		
		//wray removed
		//ctx.beginPath();
		//ctx.moveTo(nodes[0].xy[0], nodes[0].xy[1]);
		var segs = spline.segs;
		for (var i = 0; i < segs.length; i++) {
			var seg = segs[i];
			var ths = seg.get_ths();
			var ks = fit_euler(ths[0], ths[1]).ks;
			ks[2] = 0; ks[3] = 0;
			//wray added
			ctx.beginPath();
			ctx.moveTo(nodes[i].xy[0], nodes[i].xy[1]);
			//BOOKMARK
			//ctx.beginPath(); // wray's : force line to draw as segments
			if(alternating_stroke){
				ctx.strokeStyle = "rgb(0, 255, 255)";
			}else{
				ctx.strokeStyle = "rgb(210, 0, 121)";
			}
			alternating_stroke = !alternating_stroke;
			seg_to_bez(ctx, ks, seg.left.xy[0], seg.left.xy[1], seg.right.xy[0], seg.right.xy[1]);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.stroke();
	}
	console.groupEnd();
}

SpiroUi.prototype.queue_repaint = function () {
	//var start = new Date();
	var self = this;
	if (this.timeoutid) window.clearTimeout(this.timeoutid);
	this.timeoutid = window.setTimeout(function () { self.paint(); }, 1);
	//this.paint();
	//myalert(String(new Date() - start));
}



SpiroUi.prototype.down = function(evt) {
	var canvas = this.canvas;
	var x = evt.offsetX != undefined ? evt.offsetX : evt.pageX - canvas.offsetLeft;
	var y = evt.offsetY != undefined ? evt.offsetY : evt.pageY - canvas.offsetTop;
	var hit = null;
	var hitr2 = null;
	for (var i = 0; i < this.path.length; i++) {
	var xy = this.path[i];
	var r2 = (xy[0] - x) * (xy[0] - x) + (xy[1] - y) * (xy[1] - y);
	if (r2 < (hitr2 == null ? 20 : hitr2)) {
		hit = i;
		hitr2 = r2;
	}
	}
	if (hit == null) {
	this.path[i] = [x, y];
	hit = this.path.length - 1;
	this.queue_repaint();
	}
	this.hit = hit;
	evt.preventDefault();
}

SpiroUi.prototype.move = function(evt) {
	var canvas = this.canvas;
	var x = evt.offsetX != undefined ? evt.offsetX : evt.pageX - canvas.offsetLeft;
	var y = evt.offsetY != undefined ? evt.offsetY : evt.pageY - canvas.offsetTop;
	if (this.hit != null) {
	this.path[this.hit] = [x, y];
	this.queue_repaint();
	}
	evt.preventDefault();
}

SpiroUi.prototype.up = function(evt) {
	this.hit = null;
	evt.preventDefault();
}

/*
function myalert(s) {
	document.getElementById('msg').firstChild.nodeValue = s;
}
*/