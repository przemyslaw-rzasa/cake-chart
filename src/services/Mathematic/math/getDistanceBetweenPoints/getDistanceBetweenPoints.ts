/**
 * Calculate distance between in points in pixels
 *
 * Thanks to that & center of PieChart knoowledge
 * we are able to count degrees of current sector
 */
export const getDistanceBetweenPoints = ([point1, point2]: Point[]) => {
  const vx = point1.x - point2.x;
  const vy = point1.y - point2.y;

  return Math.sqrt(vx ** 2 + vy ** 2);
};
