/**
 * Given an array of array of numbers representing a 2D matrix, return the
elements of that matrix in clockwise spiral order.

Example: The spiral order of

[1, 2, 3, 4]
[5, 6, 7, 8]
[9, 10, 11, 12]

is [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

Here is another example of what spiral order should be:

     [
         [1, 2, 3]
         [4, 5, 6]
         [7, 8, 9]
     ]

 Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]

 Note that the matrix will not always be square:

     [
         [1,  2,  3,  4]
         [5,  6,  7,  8]
         [9, 10, 11, 12]
     ]

 * @param {NS} ns
 * @param {*} data
 * @returns
 */

import { ContractSolver } from "./types";

export const spiralizeMatrix: ContractSolver = (ns, data: number[][]) => {
    const results = [];

    while (data.length > 0) {
        // Go right across top
        data[0].forEach(d => results.push(d));
        data.splice(0, 1);

        // Down right hand side
        for (let i = 0; i < data.length - 1; i++) {
            if (data[i].length > 0) {
                results.push(data[i][data[i].length - 1]);
                data[i].splice(data[i].length - 1, 1);
            }
        }

        // Left across bottom
        if (data.length > 0) {
            data[data.length - 1].reverse();
            data[data.length - 1].forEach(d => results.push(d));
            data.splice(data.length - 1, 1);
        }

        // Up the left hand side
        for (let i = data.length - 1; i > 0; i--) {
            if (data[i].length > 0) {
                results.push(data[i][0]);
                data[i].splice(0, 1);
            }
        }
    }

    return results;
}