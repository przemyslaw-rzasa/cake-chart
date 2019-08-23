import { X_TO_CIRCLE_RATIO, X_CHAR_CODE } from '../../../../fixtures/label';

interface FactoryParameters {
  ctx: CanvasRenderingContext2D;
}

export const drawLabelFactory = ({ ctx }: FactoryParameters) => (
  virtualLabelData: VirtualLabel
) => {
  ctx.beginPath();

  // All labels texts will be centered
  ctx.textAlign = 'center';

  virtualLabelData.parts.forEach(part => {
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    if (virtualLabelData.info.isInner) {
      if (part.text) {
        // Draw basic label
        ctx.font = `${part.fontSize}px ${part.fontFamily}`;
        ctx.strokeText(part.text, part.point.x, part.point.y);
      } else {
        // Remove label circle
        ctx.arc(
          part.point.x,
          part.point.y - part.fontSize / 2,
          part.fontSize,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        ctx.fill();

        // Remove label 'x'
        ctx.strokeStyle = virtualLabelData.info.color;
        ctx.fillStyle = virtualLabelData.info.color;
        ctx.font = `${X_TO_CIRCLE_RATIO * part.fontSize}px`;
        ctx.strokeText(
          String.fromCharCode(X_CHAR_CODE),
          part.point.x,
          part.point.y
        );
        ctx.fillText(
          String.fromCharCode(X_CHAR_CODE),
          part.point.x,
          part.point.y
        );
      }
    }
  });
};
