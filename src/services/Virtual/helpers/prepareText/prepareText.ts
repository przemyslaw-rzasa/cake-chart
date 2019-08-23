interface MethodParameters {
  item: Item;
  labelConfig: LabelPart;
}

// Prepare text data for specific types of labelParts
export const prepareText = ({ item, labelConfig }: MethodParameters) => {
  if (labelConfig.type === 'name') {
    return item.name;
  } else if (labelConfig.type === 'percentage') {
    return `${Number((item.percentage * 100).toFixed(2))} %`;
  }

  return null;
};
