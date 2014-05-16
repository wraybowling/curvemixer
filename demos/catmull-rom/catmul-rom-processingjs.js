
// end curveVertex
      if ( isCurve && (curShape === PConstants.POLYGON || curShape === undef) ) {
        if (vertArrayLength > 3) {
          var b = [],
              s = 1 - curTightness;
          curContext.beginPath();
          curContext.moveTo(vertArray[1][0], vertArray[1][1]);
            /*
            * Matrix to convert from Catmull-Rom to cubic Bezier
            * where t = curTightness
            * |0         1          0         0       |
            * |(t-1)/6   1          (1-t)/6   0       |
            * |0         (1-t)/6    1         (t-1)/6 |
            * |0         0          0         0       |
            */
          for (i = 1; (i+2) < vertArrayLength; i++) {
            cachedVertArray = vertArray[i];
            b[0] = [cachedVertArray[0], cachedVertArray[1]];
            b[1] = [cachedVertArray[0] + (s * vertArray[i+1][0] - s * vertArray[i-1][0]) / 6,
                   cachedVertArray[1] + (s * vertArray[i+1][1] - s * vertArray[i-1][1]) / 6];
            b[2] = [vertArray[i+1][0] + (s * vertArray[i][0] - s * vertArray[i+2][0]) / 6,
                   vertArray[i+1][1] + (s * vertArray[i][1] - s * vertArray[i+2][1]) / 6];
            b[3] = [vertArray[i+1][0], vertArray[i+1][1]];
            curContext.bezierCurveTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
          }
          fillStrokeClose();
        }
      }