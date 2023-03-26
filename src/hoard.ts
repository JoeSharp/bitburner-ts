import { NS } from "@ns";
import {
  findZombies,
  findStrategy,
  getShipsRequired,
  findTargets,
  findContracts,
  solveContract,
} from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const TICK_MS = 400;
  const THREADS_PER = 10;
  const ZOMBIE_SCRIPT = "zombie.js";

  while (true) {
    // Solve any contracts we can
    const contracts = findContracts(ns);
    contracts.forEach((c) => solveContract(ns, c));

    // Now find zombies we can use to run our scripts
    const zombies = findZombies(ns, ZOMBIE_SCRIPT);
    const targets = findTargets(ns);

    ns.print(`Zombies Found ${zombies.length}`);
    zombies.forEach(({ host, threads }) =>
      ns.print(`${host} can run ${threads} threads`)
    );

    for (const target of targets) {
      if (zombies.length <= 0) {
        break;
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

            ns.exec(ZOMBIE_SCRIPT, zombie.host, threads, ...ship);

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
    }

    await ns.sleep(TICK_MS);
  }
}
