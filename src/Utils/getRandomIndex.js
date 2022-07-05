// generate unique numbers
export function genRandomIndex(arr, counter) {
  if (arr.length > 0) {
    let index = Math.floor(Math.random() * counter);
    let checkList = arr.find((card) => card === index);
    while (checkList !== undefined) {
      index = Math.floor(Math.random() * counter);
      checkList = arr.find((card) => card === index);
    }
    return index;
  } else {
    return Math.floor(Math.random() * counter);
  }
}
