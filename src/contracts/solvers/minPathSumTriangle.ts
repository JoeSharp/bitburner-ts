import { NS } from "@ns";
import { ContractSolver } from "./types";

/**
 * Given a triangle, find the minimum path sum from top to bottom.
 * In each step of the path, you may only move to adjacent numbers in the row below.
 * The triangle is represented as a 2D array of numbers:
 * [
           [6],
          [3,7],
         [4,1,3],
        [8,2,7,5],
       [7,7,5,3,2],
      [7,1,2,8,9,8],
     [3,1,1,8,6,9,4],
    [5,8,1,1,8,8,1,6],
   [6,1,8,7,8,8,7,3,2],
  [7,2,5,5,6,3,3,2,2,9]
]

 Example: If you are given the following triangle:

[
      [2],
     [3,4],
    [6,5,7],
   [4,1,8,3]
 ]

 The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
 * @param ns
 * @param data
 * @returns
 */
export const minPathSumTriangle: ContractSolver = (
  ns: NS,
  data: number[][]
): number => {
  // Start from bottom and work up
  return data
    .reverse()
    .reduce(
      (acc, curr, i) =>
        i === 0 ? curr : curr.map((a, j) => a + Math.min(acc[j], acc[j + 1])),
      []
    )[0];
};
