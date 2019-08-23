interface FactoryParameters {
  cx: number;
  cy: number;
  ctx: CanvasRenderingContext2D;
}

/**
 * Purpose of this method, is to clear whole canvas
 * just before / after drawing
 */
export const clearPieChartFactory = ({
  cx,
  cy,
  ctx
}: FactoryParameters) => () => {
  const width = cx * 2;
  const height = cy * 2;

  // Clears whole drawings
  ctx.clearRect(0, 0, width, height);
};
