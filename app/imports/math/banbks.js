/*
This came from Spiro. I have no idea what it does...
Making this file more human-readable is a priority
*/

export function banbks(mat, v, n, m) {
    var i;
    var l = m;
    for (var k = 0; k < n; k += 1) {
        if (l < n) l += 1;
        for (i = k + 1; i < l; i += 1) {
            v[i] -= mat[k].al[i - k - 1] * v[k];
        }
    }
    l = 0;
    for (i = n - 1; i >= 0; i--) {
        var mat_i = mat[i];
        var x = v[i];
        for (k = 1; k <= l; k += 1) {
            x -= mat_i.a[k] * v[k + i];
        }
        v[i] = x / mat_i.a[0];
        if (l < m + m) l += 1;
    }
}
