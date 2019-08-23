import {
  isPointWithinCircle,
  getClosestPointOnCircumferenceFactory,
  getAngleBetweenPointsFactory,
  getPointOnSectorMiddle,
  getNewPercentageShift
} from './math';

interface Parameters {
  cx: number;
  cy: number;
  radius: number;
}

export class Mathematic {
  public getClosestPointOnCircumference: (mx: number, my: number) => Point;
  public getAngleBetweenPoints: (points: Point[]) => number;

  public constructor({ cx, cy, radius }: Parameters) {
    this.getClosestPointOnCircumference = getClosestPointOnCircumferenceFactory(
      {
        cx,
        cy,
        radius
      }
    );

    this.getAngleBetweenPoints = getAngleBetweenPointsFactory({
      cx,
      cy,
      radius
    });
  }

  public isPointWithinCircle = isPointWithinCircle;

  public getPointOnSectorMiddle = getPointOnSectorMiddle;

  public getNewPercentageShift = getNewPercentageShift;
}
