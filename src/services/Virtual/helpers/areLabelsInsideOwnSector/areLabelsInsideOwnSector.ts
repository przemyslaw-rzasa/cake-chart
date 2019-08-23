/**
 * Take ImageData from the points set on the most outer label vertexs,
 * and check if colour on every of them is the same (basically check,
 * if same data is returned on All of them)
 */
export const areLabelsInsideOwnSector = (
  points: Point[],
  ctx: CanvasRenderingContext2D
) =>
  points
    .map(({ x, y }) =>
      ctx.getImageData(x, y, 1, 1).data.reduce((acc, curr) => acc + curr, '')
    )
    .every((val: string, i: number, arr: string[]) => val === arr[0]);
