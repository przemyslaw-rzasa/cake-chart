interface MethodParameters {
  centerX: number;
  centerY: number;
  x: number;
  y: number;
  r: number;
}

/**
 * Used to find, if cursor touches dragpoint / remove button
 */
export const isPointWithinCircle = ({
  centerX,
  centerY,
  x,
  y,
  r
}: MethodParameters) =>
  Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) < Math.pow(r, 2);
