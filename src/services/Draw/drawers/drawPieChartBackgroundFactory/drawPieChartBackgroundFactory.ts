interface FactoryParameters {
  cx: number;
  cy: number;
  ctx: CanvasRenderingContext2D;
  radius: number;
}

/**
 * Purpose of this method, is to draw specific arc of PieChart
 * dimensions before the current PieChart draw, as it always
 * makes image for the user consistent
 */
export const drawPieChartBackgroundFactory = ({
  cx,
  cy,
  ctx,
  radius
}: FactoryParameters) => (color: string) => {
  ctx.fillStyle = color;
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
};
