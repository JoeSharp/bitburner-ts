import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  ns.gang.getMemberNames().forEach(ns.gang.ascendMember);
}