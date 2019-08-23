import { getVirtualLabelsFactory } from './virtuals/getVirtualLabelsFactory/getVirtualLabelsFactory';
import { Mathematic } from '../Mathematic/Mathematic';

interface Parameters {
  cx: number;
  cy: number;
  radius: number;
  ctx: CanvasRenderingContext2D;
  math: Mathematic;
  labelsConfig: LabelPart[];
}

export class Virtual {
  // @todo: fix types
  public getVirtualLabels: (data: any) => VirtualLabel;

  public constructor({ cx, cy, radius, ctx, math, labelsConfig }: Parameters) {
    this.getVirtualLabels = getVirtualLabelsFactory({
      cx,
      cy,
      radius,
      ctx,
      math,
      labelsConfig
    });
  }
}
