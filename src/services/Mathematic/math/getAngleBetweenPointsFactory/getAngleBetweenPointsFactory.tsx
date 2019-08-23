import { getDistanceBetweenPoints } from '../getDistanceBetweenPoints/getDistanceBetweenPoints';

interface FactoryParameters {
  radius: number;
  cx: number;
  cy: number;
}

export const getAngleBetweenPointsFactory = ({
  radius,
  cx,
  cy
}: FactoryParameters) => ([dynamicDragPoint, stableDragPoint]: Point[]) => {
  /**
   * Point opposite to the stable point
   */
  const oppositeStablePoint = {
    x: cx - (stableDragPoint.x - cx),
    y: cy - (stableDragPoint.y - cy)
  };

  /**
   * Angle between dynamic & stable point
   */
  const angleRadians = Math.acos(
    (2 * Math.pow(radius, 2) -
      Math.pow(
        getDistanceBetweenPoints([dynamicDragPoint, stableDragPoint]),
        2
      )) /
      (2 * Math.pow(radius, 2))
  );

  /**
   * Readibility purpose
   */
  const angleDegrees = (angleRadians * 180) / Math.PI;

  /**
   * Checks, if dynamic point is placed on left or right side of line, virtually created
   * from stable point to it's opposite.
   *
   * Thanks to that we are able to count, if the angle between dynamic & stable point is
   * less than 180 degrees or greater
   */
  const side =
    (dynamicDragPoint.x - stableDragPoint.x) *
      (oppositeStablePoint.y - stableDragPoint.y) -
    (dynamicDragPoint.y - stableDragPoint.y) *
      (oppositeStablePoint.x - stableDragPoint.x);

  return side < 0 ? angleDegrees : 360 - angleDegrees;
};
