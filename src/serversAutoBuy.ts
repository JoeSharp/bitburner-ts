import { NS } from "@ns";

function getNextPowerOfTwo(value: number): number {
  let result = 1;

  while (result < value) {
    result *= 2;
  }

  return result;
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const [minInitialRAM = 4, maxTargetRAM = 2048] = ns.args as [number, number];
  ns.tprint(
    `Attempting to purchase and upgrade servers from ${minInitialRAM} to ${maxTargetRAM} GB RAM`
  );

  const purchasedServers: string[] = [];
  const upgradedServers: string[] = [];

  while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
    let buyRam: number = minInitialRAM;
    while (
      ns.getPurchasedServerCost(2 * buyRam) < ns.getPlayer().money &&
      buyRam < maxTargetRAM
    ) {
      buyRam *= 2;
    }

    if (ns.getPurchasedServerCost(buyRam) < ns.getPlayer().money) {
      purchasedServers.push(ns.purchaseServer("zombie", buyRam));
    } else {
      break;
    }
  }

  // Ensure the script is running on as many machines as possible
  ns.getPurchasedServers().forEach((ps) => {
    ns.print(`Considering Purchased Server ${ps}`);
    let psRam = ns.getServerMaxRam(ps);
    let upgradeRam = getNextPowerOfTwo(psRam);
    while (
      ns.getPurchasedServerUpgradeCost(ps, upgradeRam * 2) <
        ns.getPlayer().money &&
      upgradeRam < maxTargetRAM
    ) {
      upgradeRam *= 2;
    }
    if (upgradeRam > psRam) {
      ns.print(`Upgrading Ram for ${ps} to ${upgradeRam}`);
      const upgradeSuccess = ns.upgradePurchasedServer(ps, upgradeRam);
      ns.print(`Successful? ${upgradeSuccess ? "Yes" : "No"}`);
      if (upgradeSuccess) {
        upgradedServers.push(ps);
      }
    } else {
      ns.print(`Cannot afford to upgrade ram of ${ps}`);
    }
  });

  // Summarise
  function summarise(servers: string[], verb: string) {
    if (servers.length > 0) {
      ns.tprint(`${verb} Following Servers`);
      servers.forEach((s) => {
        ns.tprint(`${s} to ${ns.getServerMaxRam(s)}`);
      });
    } else {
      ns.tprint(`Did not ${verb} any servers`);
    }
  }

  summarise(upgradedServers, "Upgrade");
  summarise(purchasedServers, "Purchase");
}
