import { NS } from "@ns";
import { ContractSolver } from "./types";

/**
 * Finds all the prime numbers up to the value given.
 * Uses something like Sieve of Eratosthenes
 * @param max
 * @returns
 */
export function getPrimes(max: number): number[] {
  const primeNumbers = [];

  for (let i = 2; i < max; i++) {
    const isPrime = primeNumbers.find((p) => i % p === 0) === undefined;
    if (isPrime) {
      primeNumbers.push(i);
    }
  }

  return primeNumbers;
}

/**
 * Finds the largest prime factor of the given number.
 *
 * @param ns
 * @param data
 * @returns
 */
export const findLargestPrimeFactor: ContractSolver = (
  ns: NS,
  data: number
): number => {
  const largestPossible = Math.floor(Math.sqrt(data));
  const primeNumbers = getPrimes(largestPossible);
  const primeFactors = [];

  while (data > 1) {
    const nextFactor = primeNumbers.find((p) => data % p === 0);
    if (nextFactor !== undefined) {
      primeFactors.push(nextFactor);
      data /= nextFactor;
    } else {
      // We have hit bedrock
      primeFactors.push(data);
      break;
    }
  }

  return Math.max(...primeFactors);
};
