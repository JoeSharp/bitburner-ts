import { NS } from "@ns";
import { ContractSolver } from "./types";

/**
 * Solves the coding contract for finding overlapping
 * intervals and merging them into a new list.
 *
 * @param data, an array of 2-item arrays
 * @returns merged, a new array of 2-item arrays
 */
export const mergeOverlap: ContractSolver = (
  ns: NS,
  data: number[][]
): number[][] => {
  // Sort the items by their 'starting' position
  data.sort(([a], [b]) => a - b);

  // Compose an answer
  const answer = [];

  // Push the first interval on
  answer.push([...data[0]]);
  let i = 1;

  while (i < data.length) {
    // Iterate through each input item
    const nextData = data[i];

    // What is the last interval we added to the result?
    const lastAnswer = answer[answer.length - 1];

    if (nextData[0] <= lastAnswer[1]) {
      // This next interval overlaps
      if (lastAnswer[1] < nextData[1]) {
        // ...and it's endpoint is higher
        lastAnswer[1] = nextData[1];
      }
    } else {
      // This new interval does not overlap
      answer.push([...nextData]);
    }

    i++;
  }

  return answer;
};
