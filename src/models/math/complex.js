/*
 * math-complex.js
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  References:
 *      search.cpan.org/perldoc?Math::Complex
 */

export class Complex {
  constructor(real = 0, imaginary = 0) {
    this.real = real;
    this.imaginary = imaginary;
  }

  toString() {
    let string = String(this.real);
    if (this.imaginary) {
      if (this.imaginary > 0) string += '+';
      string += this.imaginary;
      string += 'i';
    }
    return string;
  }

  polar(abs, arg) {
    return new Complex(abs * Math.cos(arg), abs * Math.sin(arg));
  }

  neg() {
    return new Complex(-this.re, -this.im);
  }

  con() {
    return new Complex(this.re, -this.im);
  }

  arg() {
    return Math.atan2(this.im, this.re);
  }

  abs() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }

  norm() {
    return this.re * this.re + this.im * this.im;
  }

  add(that) {
    return (that.constructor === this.constructor)
          ? new Complex(this.re + that.re, this.im + that.im)
          : new Complex(this.re + (+that), this.im);
  }

  sub(that) {
    return (that.constructor === this.constructor)
          ? new Complex(this.re - that.re, this.im - that.im)
          : new Complex(this.re - (+that), this.im);
  }

  mul(that) {
    return (that.constructor === this.constructor)
          ? new Complex(
              this.re * that.re - this.im * that.im,
              this.im * that.re + this.re * that.im
          )
          : new Complex(this.re * (+that), this.im * (+that));
  }

  div(that) {
    if (that.constructor === this.constructor) {
      const d = that.re * that.re + that.im * that.im;
      if (d === 0) return new Complex(this.re / 0, this.im / 0);
      return new Complex(
        (this.re * that.re + this.im * that.im) / d,
        (this.im * that.re - this.re * that.im) / d
      );
    }

    return new Complex(
      this.re / (+that), this.im / (+that)
    );
  }

  exp() {
    const abs = Math.exp(this.real);
    const arg = this.imaginary;
    return new Complex(abs * Math.cos(arg), abs * Math.sin(arg));
  }

  log() {
    return new Complex(Math.log(this.abs()), this.arg());
  }

  pow(that) {
    return (that.constructor === this.constructor)
          ? that.mul(this.log()).exp()
          : (new Complex(that, 0)).mul(this.log()).exp();
  }

  sqrt() {
      /* return this.pow(0.5); */
      /* http://en.wikipedia.org/wiki/Square_root#Algebraic_formula */
      var r = this.abs();
      return new Complex(
          Math.sqrt((r + this.re) / 2),
          this.im < 0 ? -Math.sqrt((r - this.re) / 2)
              :  Math.sqrt((r - this.re) / 2)
      );
  }

  cos() {
      return this.mul(j).exp().add(this.neg().mul(j).exp())
          .div(2);
  }

  sin() {
      return this.mul(j).exp().sub(this.neg().mul(j).exp())
          .div(j.mul(2));
  }

  tan() {
      return this.cos().div(this.sin());
  }

  acos() {
      return this.add(this.mul(this).neg().add(1).sqrt().mul(j))
          .log().mul(j).neg();
  }

  asin() {
      return this.mul(j).add(this.mul(this).neg().add(1).sqrt())
          .log().mul(j).neg();
  }

  atan() {
      var d = j.mul(this).add(1);
      return d.con().log().sub(d.log()).mul(j).div(2);
  }

  eq(that) {
    if (that.constructor === this.constructor) {
      return this.re === that.re && this.im === that.im;
    }
    return this.eq(new Complex(that, 0));
  }

  ne(that) {
      return ! this.eq(that);
  }

  approx(that) {
      if (that.constructor === this.constructor) {
          return this.re === that.re && this.im === that.im
              ? true
              : this.sub(that).abs()/this.add(that).abs() < 2*EPSILON;
      } else {
          return this.approx(new Complex(that, 0));
      }
  }
}


//   var EPSILON = Math.pow(2,-52);
//   Complex.VERSION = "0.3.0";
//   let j = new Complex(0, 1);
// //  var slice = Array.prototype.slice;
//
//   Complex.I = Complex.J = j;
//
//   (function(meths) {
//       for (var p in meths) Complex.prototype[p] = meths[p];
//       for (var p in meths) Complex[p] = (function(meth) {
//           return meth.length
//               ? function(x, y) {
//                   return meth.call(x instanceof Complex ? x : new Complex(x), y);
//               }
//           : function(x) {
//               return meth.call(x instanceof Complex ? x : new Complex(x));
//           };
//       })(meths[p]);
//   })({
//
//   });
//   // export
//   Math.Complex = Complex;
//
