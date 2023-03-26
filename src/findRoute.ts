import { NS } from "@ns";
import { findHosts } from "./utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const [target] = ns.args;

  const { foundVia } = await findHosts(ns);

  const here = ns.getHostname();

  let current = target;
  const hops = [];
  while (!!current && current !== here) {
    hops.push(current);
    current = foundVia.get(current);
  }

  hops.push(here);

  ns.tprint(`Route from ${here} to ${target}`);
  hops.reverse();
  hops.forEach((h) => ns.tprint(`\t${h}`));
}
