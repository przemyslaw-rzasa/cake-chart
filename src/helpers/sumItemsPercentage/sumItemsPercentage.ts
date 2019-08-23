export const sumItemsPercentage = (items: Item[]) =>
  items.reduce((acc: number, curr: Item) => acc + curr.percentage, 0);
