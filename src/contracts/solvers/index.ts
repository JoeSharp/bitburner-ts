import { spiralizeMatrix } from "contracts/solvers/spiraliseMatrix";
import {
  algorithmicStockTrader1,
  algorithmicStockTrader2,
  algorithmicStockTrader3,
} from "contracts/solvers/algorithmicStockTrader";
import { findLargestPrimeFactor } from "contracts/solvers/findLargestPrimeFactor";
import { mergeOverlap } from "contracts/solvers/mergeOverlap";
import { sanitiseParenthesis } from "contracts/solvers/sanitiseParenthesis";
import { subArrayWithMaxSum } from "contracts/solvers/subArrayWithMaxSum";
import { NamedContractSolvers } from "contracts/solvers/types";
import { minPathSumTriangle } from "/contracts/solvers/minPathSumTriangle";
import { caesarOne } from "contracts/solvers/encryption";

const contractSolvers: NamedContractSolvers = {
  "Merge Overlapping Intervals": mergeOverlap,
  "Algorithmic Stock Trader I": algorithmicStockTrader1,
  "Algorithmic Stock Trader II": algorithmicStockTrader2,
  "Algorithmic Stock Trader III": algorithmicStockTrader3,
  "Find Largest Prime Factor": findLargestPrimeFactor,
  "Sanitize Parentheses in Expression": sanitiseParenthesis,
  "Subarray with Maximum Sum": subArrayWithMaxSum,
  "Spiralize Matrix": spiralizeMatrix,
  "Minimum Path Sum in a Triangle": minPathSumTriangle,
  "Encryption I: Caesar Cipher": caesarOne,
};

export default contractSolvers;
