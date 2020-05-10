function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function shuffle<T>(items: T[]) {
  for (let index = 0; index < items.length; index++) {
    const swap = getRandomInt(items.length);
    const indexItem = items[index];
    const swapItem = items[swap];
    items[index] = swapItem;
    items[swap] = indexItem;
  }
  return items;
}
