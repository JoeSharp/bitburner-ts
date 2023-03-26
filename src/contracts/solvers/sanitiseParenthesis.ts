import { ContractSolver } from "./types";

/**
 * Recursively finds all the possible combinations of the given inputs.
 *
 * @param {array} inputs
 * @param {number} lengthOutput
 * @returns The possible combinations at the given length.
 */
export function getCombinations<T>(inputs: T[], lengthOutput: number): T[][] {
  if (lengthOutput === 0) {
    return [];
  }

  if (lengthOutput === 1) {
    return inputs.map((i) => [i]);
  }

  const results: T[][] = [];
  inputs.forEach((input) => {
    getCombinations(
      inputs.filter((i) => i !== input),
      lengthOutput - 1
    ).forEach((c) => {
      results.push([input, ...c]);
    });
  });

  return results;
}

/**
 * Given a list, removes duplicates.
 *
 * @param {list} theList
 * @returns A version of the list with the duplicates removed.
 */
export function deduplicateList<T>(
  theList: T[],
  comparator = (a: T, b: T) => a === b
) {
  return theList.filter(
    (a, index) => index === theList.findIndex((b) => comparator(a, b))
  );
}

/**
 * Returns a string with the letters at the given indices removed.
 *
 * @param {string} data
 * @param {number[]} indexesToRemove
 * @returns
 */
export function getCutString(data: string, indexesToRemove: number[]): string {
  return data
    .split("")
    .filter((c, i) => !indexesToRemove.includes(i))
    .join("");
}

const BRACKET_TYPES = [
  {
    opening: "(",
    closing: ")",
  },
  {
    opening: "{",
    closing: "}",
  },
  {
    opening: "[",
    closing: "]",
  },
];
const ALL_BRACKETS = BRACKET_TYPES.reduce(
  (acc, curr) => `${acc}${curr.opening}${curr.closing}`,
  ""
);
const NO_MATCH = -1;

/**
 * Determines if a string has valid pairs of brackets.
 *
 * @param {string} data
 * @returns {boolean} If the given data has valid paired brackets
 */
export function isParenthesisValid(data: string): boolean {
  let errorFound = false;
  const bracketQueue: number[] = [];
  data.split("").forEach((d) => {
    const openingIndex = BRACKET_TYPES.findIndex((p) => p.opening === d);
    const closingIndex = BRACKET_TYPES.findIndex((p) => p.closing === d);
    if (openingIndex !== NO_MATCH) {
      bracketQueue.push(openingIndex);
    } else if (closingIndex !== NO_MATCH) {
      if (bracketQueue.length === 0) {
        errorFound = true;
      } else if (bracketQueue[0] !== closingIndex) {
        errorFound = true;
      } else {
        bracketQueue.pop();
      }
    }
  });

  if (bracketQueue.length > 0) {
    errorFound = true;
  }

  return !errorFound;
}

/**
 * Given the following string:
    (()(()(())))))(a

    remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

    IMPORTANT: The string may contain letters, not just parentheses. Examples:
    "()())()" -> [()()(), (())() ]
    "(a)())()" -> [(a)()(), (a())()]
    ")( -> [""]
 * @param {string} data
 * @returns
 */
export const sanitiseParenthesis: ContractSolver = (
  ns,
  data: string
): string[] => {
  let validWays: string[] = [];

  const bracketIndexes = data
    .split("")
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => ALL_BRACKETS.includes(s))
    .map(({ i }) => i);

  let j = 0;
  while (j < data.length && validWays.length === 0) {
    validWays = getCombinations(bracketIndexes, j)
      .map((combination) => getCutString(data, combination))
      .filter((o) => isParenthesisValid(o));
    j++;
  }

  return deduplicateList(validWays);
};
