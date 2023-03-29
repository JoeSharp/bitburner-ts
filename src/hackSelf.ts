import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const [target] = ns.args as [string];

  const MAX_SECURITY = ns.getServerMinSecurityLevel(target) * 1.3;
  const MIN_MONEY = ns.getServerMaxMoney(target) * 0.7;

  while (true) {
    if (ns.getServerMoneyAvailable(target) < MIN_MONEY) {
      await ns.grow(target);
    }

    if (ns.getServerSecurityLevel(target) > MAX_SECURITY) {
      await ns.weaken(target);
    }

    await ns.hack(target);
  }
}
