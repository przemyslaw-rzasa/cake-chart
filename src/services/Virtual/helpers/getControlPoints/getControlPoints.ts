type ControlPointType = 'top' | 'middle' | 'bottom';
interface ControlPointInputData {
  point: { x: number; y: number };
  measure: Measure;
}

export const getControlPoints = (
  type: ControlPointType,
  { point, measure }: ControlPointInputData
) => {
  if (type === 'top') {
    const topLeft = {
      x: point.x - measure.width / 2,
      y: point.y - measure.height
    };

    const topRight = {
      x: point.x + measure.width / 2,
      y: point.y - measure.height
    };

    return [topLeft, topRight];
  } else if (type === 'bottom') {
    const bottomLeft = {
      x: point.x - measure.width / 2,
      y: point.y
    };

    const bottomRight = {
      x: point.x + measure.width / 2,
      y: point.y
    };

    return [bottomLeft, bottomRight];
  } else {
    const topLeft = {
      x: point.x - measure.width / 2,
      y: point.y - measure.height
    };

    const topRight = {
      x: point.x + measure.width / 2,
      y: point.y - measure.height
    };

    const bottomLeft = {
      x: point.x - measure.width / 2,
      y: point.y
    };

    const bottomRight = {
      x: point.x + measure.width / 2,
      y: point.y
    };

    return [topLeft, topRight, bottomLeft, bottomRight];
  }
};
