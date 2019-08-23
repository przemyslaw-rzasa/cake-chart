import { Mathematic } from '../../../Mathematic/Mathematic';
import { DISTANCE_FROM_CENTER_RATIO } from '../../../../fixtures/label';
import {
  measureLabelPart,
  areLabelsInsideOwnSector,
  prepareText,
  getControlPoints,
  getControlPointType
} from '../../helpers';

interface FactoryParameters {
  ctx: CanvasRenderingContext2D;
  math: Mathematic;
  cx: number;
  cy: number;
  radius: number;
  labelsConfig: LabelPart[];
}

export interface MethodParameters {
  items: Item[];
  percentageShift: number;
  draggingStatus: DraggingStatus;
  stableDragPoint: DragPoint;
  item: Item;
  itemIndex: number;
}

export const getVirtualLabelsFactory = ({
  ctx,
  math,
  cx,
  cy,
  radius,
  labelsConfig
}: FactoryParameters) => ({ percentageShift, item }: MethodParameters) => {
  ctx.save();

  /**
   * Thanks to placement of function in this place, we are able to count
   * proper shift on the sector mid, just using the one (offset) parameterr
   */
  const getPointFromMiddle = (offset: number = 0) =>
    math.getPointOnSectorMiddle({
      cx,
      cy: cy + offset,
      percentage: item.percentage,
      percentageShift,
      distanceFromPieChartCenter: radius * DISTANCE_FROM_CENTER_RATIO
    });

  /**
   * This item will be finally returned, Label will be drawn based on its data
   *
   * Parts: list of all parts enabled in a Piechart
   * Info: informations about the color & generala placement
   */
  const virtualLabel: VirtualLabel = {
    parts: [],
    info: {
      isInner: true,
      color: item.color
    }
  };

  /**
   * Based on a control points, application is deciding where does
   * the label should be places
   */
  let controlPoints: Point[] = [];

  /**
   * Iterate thru all allowed labelParts for the item, prepare data
   * for drawing & add control points required in a later validation
   */
  labelsConfig.forEach((labelConfig, i) => {
    const font = `${labelConfig.fontSize}px ${labelConfig.fontFamily}`;

    ctx.font = font;

    const text = prepareText({ item, labelConfig });
    const measure: Measure = measureLabelPart(text, labelConfig, ctx);
    const point = getPointFromMiddle(labelConfig.offset);
    const controlPointsType = getControlPointType(labelsConfig, i);

    controlPoints = controlPoints.concat(
      getControlPoints(controlPointsType, {
        point,
        measure
      })
    );

    virtualLabel.parts.push({
      point,
      text,
      fontSize: labelConfig.fontSize,
      fontFamily: labelConfig.fontFamily
    });
  });

  // Based on a controlPoints, check if label is within the sectorr
  virtualLabel.info.isInner = areLabelsInsideOwnSector(controlPoints, ctx);

  ctx.restore();

  // @todo: testing reasons, to remove after the implementation
  ctx.fillStyle = 'lime';
  controlPoints.forEach((controlPoint: Point) => {
    ctx.fillRect(controlPoint.x, controlPoint.y, 3, 3);
  });

  return virtualLabel;
};
