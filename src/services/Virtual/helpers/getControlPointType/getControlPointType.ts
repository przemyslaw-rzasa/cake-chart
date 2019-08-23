/**
 * Based on the current labelPart position, check what types of
 * control points should be assigned to them
 */
export const getControlPointType = (
  labelsConfig: LabelPart[],
  index: number
) => {
  // First element of many elements is always top
  if (index === 0 && labelsConfig.length > 1) {
    return 'top';
  }

  // Second element of 2 elements is always bottom
  if (index === 1 && labelsConfig.length === 2) {
    return 'bottom';
  }

  // Third element of 3 elements is always middle
  if (index === 2 && labelsConfig.length === 3) {
    return 'bottom';
  }

  return 'middle';
};
