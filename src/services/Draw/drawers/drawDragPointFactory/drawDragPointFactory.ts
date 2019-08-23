import { DRAG_POINT_RADIUS } from '../../../../fixtures/dragPoint';

interface FactoryParameters {
  ctx: CanvasRenderingContext2D;
}

interface MethodParameters {
  id: string;
  x: number;
  y: number;
}

export const drawDragPointFactory = ({ ctx }: FactoryParameters) => ({
  id,
  x,
  y
}: MethodParameters) => {
  ctx.beginPath();

  // Move to the right side of future dragPoint, as arc isn't drawed from middle
  ctx.moveTo(x + DRAG_POINT_RADIUS, y);

  // Dragpoint itself
  ctx.arc(x, y, DRAG_POINT_RADIUS, 0, 2 * Math.PI);

  // Fill dragPoint with specific color
  ctx.fillStyle = 'lightGrey';
  ctx.fill();

  // Stroke dragPoint with specific color
  ctx.strokeStyle = 'darkGrey';
  ctx.stroke();

  return { x, y, r: DRAG_POINT_RADIUS, id };
};
