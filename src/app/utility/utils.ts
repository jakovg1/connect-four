/**
 * Returns a random integer between min and max (min is inclusive, max is exclusive)
 * @param min
 * @param max
 * @returns random integer between min and max
 */
export function getRandomIntInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
