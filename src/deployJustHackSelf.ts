import { NS } from "@ns";

import {
  runScriptOnServerMaxThreads,
  canHack,
  findZombies,
  findTargets,
} from "utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const ZOMBIE_SCRIPT = "justHackSelf.js";
  const [homeReserveRam] = ns.args as [number];

  while (true) {
    const [altTarget] = findTargets(ns)[0];

    findZombies(ns, ZOMBIE_SCRIPT, homeReserveRam).forEach((zombie) => {
      const target = canHack(ns, zombie.host) ? zombie.host : altTarget;
      runScriptOnServerMaxThreads(ns, ZOMBIE_SCRIPT, zombie.host, [target]);
    });

    await ns.sleep(10000);
  }
}
