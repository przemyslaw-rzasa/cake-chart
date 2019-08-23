/**
 * Based on the labelPart type and it's text and fontSize
 * (radius is also treated as fontSize, unify reasons),
 * check width & height of element when it will be drawn
 */
export const measureLabelPart = (
  text: string | null,
  labelConfig: LabelPart,
  ctx: CanvasRenderingContext2D
) => {
  if (labelConfig.type === 'remove') {
    return {
      width: (labelConfig.fontSize as number) * 2,
      height: (labelConfig.fontSize as number) * 1.5
    };
  } else if (labelConfig.type === 'name') {
    return {
      width: ctx.measureText(text as string).width,
      height: labelConfig.fontSize
    };
  } else if (labelConfig.type === 'percentage') {
    return {
      width: ctx.measureText(text as string).width,
      height: labelConfig.fontSize
    };
  }

  throw new Error('Wrong type');
};
