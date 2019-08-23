interface FactoryParameters {
  cx: number;
  cy: number;
  radius: number;
}

/**
 * This method is finding closest point on circumference
 *
 * mx - mouse (cursor) x position
 * my - mouse (cursor) y position
 */
export const getClosestPointOnCircumferenceFactory = ({
  cx,
  cy,
  radius
}: FactoryParameters) => (mx: number, my: number) => {
  const vX = mx - cx;
  const vY = my - cy;

  const magV = Math.sqrt(vX ** 2 + vY ** 2);

  const aX = cx + (vX / magV) * radius;
  const aY = cy + (vY / magV) * radius;

  return { x: aX, y: aY };
};
