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
