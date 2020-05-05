const distSq = (x1, y1, x2, y2) => Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);

const dist = (x1, y1, x2, y2) => Math.sqrt(distSq(x1, y1, x2, y2));