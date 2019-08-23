interface PointSectorMiddleParameters {
  cx: number;
  cy: number;
  percentageShift: number;
  percentage: number;
  distanceFromPieChartCenter: number;
}

/**
 * Purpose of this method, is to return point which will be in the middle
 * of the current sector.
 *
 * Main usage: calculating / drawing labels
 */
export const getPointOnSectorMiddle = ({
  cx,
  cy,
  percentageShift,
  percentage,
  distanceFromPieChartCenter
}: PointSectorMiddleParameters) => ({
  x:
    cx +
    distanceFromPieChartCenter *
      Math.cos((360 * (percentageShift + percentage / 2) * Math.PI) / 180),
  y:
    cy +
    distanceFromPieChartCenter *
      Math.sin((360 * (percentageShift + percentage / 2) * Math.PI) / 180)
});
