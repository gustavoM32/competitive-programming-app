export const getPossibleFieldValues = (
  objectList: any,
  field: string
): string[] => {
  console.log("calc");
  const valuesSet = new Set<string>();
  for (let object of objectList) {
    if (object[field] != null) valuesSet.add(object[field]);
  }
  return Array.from(valuesSet);
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};
