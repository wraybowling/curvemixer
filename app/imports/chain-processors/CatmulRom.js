// converts catmul-rom points into cornered cubic castel curve points (3 coordinates)

export class CatmulRom extends Chain {
	// coordinates (array) FIXME

	constructor(){
		super();
	}

	getPathData(){
		var d = [], i, iLen, p;
		for (i = 0, iLen = coordinates.length; (iLen - 2 * !closed) > i; i += 2) {
			p = [
				{x: +coordinates[i - 2], y: +coordinates[i - 1]},
				{x: +coordinates[i],     y: +coordinates[i + 1]},
				{x: +coordinates[i + 2], y: +coordinates[i + 3]},
				{x: +coordinates[i + 4], y: +coordinates[i + 5]}
			];
			if (closed) {
				if (!i) {
					p[0] = {x: +coordinates[iLen - 2], y: +coordinates[iLen - 1]};
				} else if (iLen - 4 === i) {
					p[3] = {x: +coordinates[0], y: +coordinates[1]};
				} else if (iLen - 2 === i) {
					p[2] = {x: +coordinates[0], y: +coordinates[1]};
					p[3] = {x: +coordinates[2], y: +coordinates[3]};
				}
			} else {
				if (iLen - 4 === i) {
					p[3] = p[2];
				} else if (!i) {
					p[0] = {x: +coordinates[i], y: +coordinates[i + 1]};
				}
			}
			d.push("C");

			d.push((-p[0].x + 6 * p[1].x + p[2].x) / 6);
			d.push((-p[0].y + 6 * p[1].y + p[2].y) / 6);

			d.push((p[1].x + 6 * p[2].x - p[3].x) / 6);
			d.push((p[1].y + 6 * p[2].y - p[3].y) / 6);

			d.push(p[2].x);
			d.push(p[2].y);
		}

		return d;
	}
}
