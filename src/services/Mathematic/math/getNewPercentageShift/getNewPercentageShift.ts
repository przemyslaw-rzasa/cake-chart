import { sumItemsPercentage } from '../../../../helpers/';

interface MethodParameters {
  items: Item[];
  item: Item;
  itemIndex: number;
  draggingStatus: DraggingStatus;
  immobileDragPoint: DragPoint;
  percentageShift: number;
}

export const getNewPercentageShift = ({
  items,
  item,
  itemIndex,
  draggingStatus,
  immobileDragPoint,
  percentageShift
}: MethodParameters) => {
  let newPercentageShift = percentageShift;

  // New shift is needed, only if PieChart isi changing
  if (draggingStatus.enabled) {
    // Index of the immobile dragPoint
    const stableIndex = immobileDragPoint.index as number;

    /**
     * If current dragPoint is placed before the immobile dragPoint:
     * 1. Sum all of the percentages, which are between this dragPoint and immobile one
     * 2. Increase this ^ sum with current dragPointt's item percentage
     * 3. Remove this sum from the immobile percentageShift
     */
    if (itemIndex < stableIndex) {
      const itemsBeforeStable = items.slice(itemIndex, stableIndex);
      const percentageSumBeforeStable = sumItemsPercentage(itemsBeforeStable);

      newPercentageShift =
        immobileDragPoint.percentageShift -
        percentageSumBeforeStable +
        item.percentage;

      /**
       * If currently counted dragPoint, new percentageShift will be immutable one
       * increased by the current item percentage
       */
    } else if (itemIndex === stableIndex) {
      newPercentageShift = immobileDragPoint.percentageShift + item.percentage;
      /**
       * If current dragPoint is placed after the immobile dragPoint:
       * 1. Sum all of the percentages, which are between immobile dragPoint and this one
       * 2. Increase this ^ sum with current dragPointt's item percentage
       * 3. Add this sum to the immobile percentageShift
       */
    } else if (itemIndex > stableIndex) {
      const itemsAfterStable = items.slice(stableIndex, itemIndex);
      const percentageSumAfterStable = sumItemsPercentage(itemsAfterStable);

      newPercentageShift =
        immobileDragPoint.percentageShift +
        percentageSumAfterStable +
        item.percentage;
    }
  } else {
    /**
     * As during the mount user is not modifying PieChart's state,
     * percentageShift is counted in the simpliest possible way
     */
    newPercentageShift += item.percentage;
  }

  return newPercentageShift;
};
