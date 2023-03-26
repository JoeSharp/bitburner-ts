import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  while (true) {
    // Try and buy new nodes
    if (ns.getPlayer().money >= ns.hacknet.getPurchaseNodeCost()) {
      ns.hacknet.purchaseNode();
    }

    // Check existing nodes
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      // Try to upgrade cores first
      if (ns.getPlayer().money >= ns.hacknet.getCoreUpgradeCost(i, 1)) {
        ns.hacknet.upgradeCore(i, 1);
      }

      if (ns.getPlayer().money >= ns.hacknet.getRamUpgradeCost(i, 1)) {
        ns.hacknet.upgradeRam(i, 1);
      }

      if (ns.getPlayer().money >= ns.hacknet.getLevelUpgradeCost(i, 1)) {
        ns.hacknet.upgradeLevel(i, 1);
      }
    }

    await ns.sleep(100);
  }
}
