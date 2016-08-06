/*
This came from Spiro. I'm not clear on what it's used for...
...something to do with Matrices obviously...
Making this file more human-readable is a priority
*/

export function bandec(matrix, n, m) {
    var i, j, l = m;
    for (i = 0; i < m; i += 1) {
        for (j = 0; j <= i + m; j += 1) {
            matrix[i].a[j] = matrix[i].a[j + m - i];
        }
        for (j; j <= m * 2; j += 1) {
            matrix[i].a[j] = 0;
        }
    }
    for (i = 0; i < n; i += 1) {
        matrix[i].al = [];
        if (l < n) {
            l += 1;
        }
        var pivot_val = matrix[i].a[0];
        if (Math.abs(pivot_val) < 1e-12) {
            pivot_val = 1e-12;
        }
        for (j = i + 1; j < l; j += 1) {
            var x = matrix[j].a[0] / pivot_val;
            matrix[i].al[j - i - 1] = x;
            for (k = 1; k <= m + m; k += 1) {
                matrix[j].a[k - 1] = matrix[j].a[k] - x * matrix[i].a[k];
            }
            matrix[j].a[m + m] = 0;
        }
    }
}
