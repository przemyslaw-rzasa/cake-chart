import {
  drawSectorFactory,
  drawLabelFactory,
  drawDragPointFactory,
  drawPieChartBackgroundFactory,
  clearPieChartFactory
} from './drawers';

interface Parameters {
  cx: number;
  cy: number;
  radius: number;
  ctx: CanvasRenderingContext2D;
}

export class Draw {
  private cx: number;
  private cy: number;
  private radius: number;
  private ctx: CanvasRenderingContext2D;

  // @todo: fix types
  public sector?: any;
  public label?: any;
  public dragPoint?: any;
  public pieChartBackground: any;
  public clear: any;

  public constructor({ cx, cy, radius, ctx }: Parameters) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.ctx = ctx as CanvasRenderingContext2D;

    this.sector = drawSectorFactory({
      cx: this.cx,
      cy: this.cy,
      radius: this.radius,
      ctx: this.ctx
    });

    this.label = drawLabelFactory({
      ctx: this.ctx
    });

    this.dragPoint = drawDragPointFactory({
      ctx: this.ctx
    });

    this.pieChartBackground = drawPieChartBackgroundFactory({
      cx: this.cx,
      cy: this.cy,
      radius: this.radius,
      ctx: this.ctx
    });

    this.clear = clearPieChartFactory({
      cx: this.cx,
      cy: this.cy,
      ctx: this.ctx
    });
  }
}
