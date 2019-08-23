interface FactoryParamerers {
  cx: number;
  cy: number;
  radius: number;
  ctx: CanvasRenderingContext2D;
}

interface MethodParameters {
  percentage: number;
  color: string;
  hasError: boolean;
}

export const drawSectorFactory = ({
  cx,
  cy,
  radius,
  ctx
}: FactoryParamerers) => (
  { percentage, color, hasError }: MethodParameters,
  percentageShift: number
) => {
  ctx.beginPath();
  ctx.moveTo(cx, cy);

  // Start arc point is always on the current percentageShift
  const startArcPoint = percentageShift * (2 * Math.PI);

  /**
   * Finish arc point is always on the current percentageShift
   * increased by percentage. Thanks to that sector always
   * shows the right proportion
   */
  const endArcPoint = (percentage + percentageShift) * (2 * Math.PI);

  // Draw sector
  ctx.arc(cx, cy, radius, startArcPoint, endArcPoint);
  ctx.closePath();

  // Color sector & add special styling parameters based on properties
  ctx.fillStyle = color;
  ctx.strokeStyle = hasError ? 'red' : 'white';
  ctx.lineWidth = hasError ? 2 : 1;

  ctx.fill();
  ctx.stroke();
};
