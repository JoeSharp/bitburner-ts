import { NS } from "@ns";
import { findHosts } from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const { allHosts } = findHosts(ns);
  allHosts.forEach((h) => ns.killall(h));
}
