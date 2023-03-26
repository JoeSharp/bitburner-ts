import { NS } from "@ns";

/**
 * Given the following integer array,
 * find the contiguous subarray (containing at least one number)
 * which has the largest sum and return that sum.
 * 'Sum' refers to the sum of all the numbers in the subarray.
 * -2,-7,6,-6,5,0,4,1,7,-10,9,-9,6,-7,-4,-6,0,-2,-1,7,7,1,-1,-7,4,7,-1,-4,-1,9,4,-10,9,-10,6,5,7
 *
 * @param {NS} ns
 * @param {Array} data
 * @returns {number} The highest sum
 */
export function subArrayWithMaxSum(ns: NS, data: number[]): number {
  let highest = {
    sum: -Infinity,
    fromIndex: 0,
    toIndex: 0,
  };

  for (let from = 0; from < data.length - 1; from++) {
    for (let to = 1; to <= data.length; to++) {
      const sum = data.slice(from, to).reduce((acc, curr) => acc + curr, 0);
      if (sum > highest.sum) {
        ns.tprint(`Found New High ${from} -> ${to} with Sum ${sum}`);
        highest = {
          sum,
          fromIndex: from,
          toIndex: to,
        };
      }
    }
  }

  return highest.sum;
}
