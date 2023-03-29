import { NS } from "@ns";
import { findHosts } from "./utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const [target] = ns.args as [string];

  const { foundVia } = await findHosts(ns);

  const here = ns.getHostname();

  let current = target;
  const hops: string[] = [];
  while (!!current && current !== here) {
    hops.push(current);
    current = foundVia.get(current);
  }

  hops.push(here);

  ns.tprint(`Route from ${here} to ${target}`);
  hops.reverse();
  hops.forEach((h) => ns.tprint(`\t${h}`));

  navigator.clipboard.writeText(
    hops.reduce((acc, curr) => `${acc}connect ${curr}; `, "")
  );
}
