import { NS } from "@ns";
import {
  findZombies,
  findStrategy,
  getShipsRequired,
  findTargets,
} from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const TICK_MS = 500;
  const THREADS_PER = 10;
  const ZOMBIE_SCRIPT = "zombie.js";

  const [homeReserveRam] = ns.args as [number];

  ns.disableLog("getServerMaxMoney");
  ns.disableLog("getServerRequiredHackingLevel");
  ns.disableLog("getServerNumPortsRequired");
  ns.disableLog("getServerSecurityLevel");
  ns.disableLog("getServerMinSecurityLevel");
  ns.disableLog("getServerMoneyAvailable");
  ns.disableLog("getHackingLevel");
  ns.disableLog("getServerMaxRam");
  ns.disableLog("getServerUsedRam");
  ns.disableLog("scan");
  ns.disableLog("scp");
  ns.disableLog("sleep");
  ns.disableLog("exec");

  const deployedShipsByTarget: Map<string, number[]> = new Map();

  while (true) {
    // Now find zombies we can use to run our scripts
    const zombies = findZombies(ns, ZOMBIE_SCRIPT, homeReserveRam);
    const targets = findTargets(ns);

    if (zombies.length <= 0) {
      await ns.sleep(TICK_MS);
      continue;
    }

    ns.print(`Zombies Found ${zombies.length}`);
    zombies.forEach(({ host, threads }) =>
      ns.print(`${host} can run ${threads} threads`)
    );

    for (const target of targets) {
      if (zombies.length <= 0) {
        break;
      }

      // Ensure we have an entry for this target
      let deployedShips: number[] =
        deployedShipsByTarget
          .get(target)
          ?.filter((s) => ns.getRunningScript(s, target)) ?? [];

      if (deployedShips.length > 0) {
        ns.print(
          `Ships already deployed against ${target}, ${deployedShips.join(
            ","
          )} skipping`
        );
        continue;
      }

      const strategy = findStrategy(ns, target);
      ns.print(`Target Found: ${target}, Requires: ${strategy}`);

      const shipsRequired = getShipsRequired(ns, target, strategy);

      shipsRequired.forEach((ship) => {
        let threadsRemaining = THREADS_PER;
        while (threadsRemaining > 0) {
          if (zombies.length > 0) {
            const zombie = zombies[0];
            const threads = Math.min(threadsRemaining, zombie.threads);

            ns.print(
              `Running Ship ${ship} on ${zombie.host} with threads ${threads}`
            );

            const pid = ns.exec(ZOMBIE_SCRIPT, zombie.host, threads, ...ship);
            deployedShips.push(pid);

            zombie.threads -= threads;
            threadsRemaining -= threads;
            if (zombie.threads <= 0) {
              zombies.shift();
            }
          } else {
            ns.print(`Could not find zombie to run ship`);
            break;
          }
        }
      });

      deployedShipsByTarget.set(target, deployedShips);
    }

    await ns.sleep(TICK_MS);
  }
}
