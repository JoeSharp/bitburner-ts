import { NS } from "@ns";
import { findHosts } from "./utils";

/** @param {NS} ns */
export async function main(ns: NS) {
  const programs = new Map();
  programs.set("BruteSSH.exe", ns.brutessh);
  programs.set("FTPCrack.exe", ns.ftpcrack);
  programs.set("relaySMTP.exe", ns.relaysmtp);
  programs.set("HTTPWorm.exe", ns.httpworm);
  programs.set("SQLInject.exe", ns.sqlinject);

  const programsAvailable = [...programs.keys()].filter((file) =>
    ns.fileExists(file)
  ).length;
  ns.tprint(`${programsAvailable} for cracking ports`);

  const { allHosts: zombies, foundVia } = findHosts(ns);

  const newlyHacked: string[] = [];

  // Find a list of potentially hackable machines
  const hackedZombies = zombies
    .filter((t) => t !== ns.getHostname())
    .filter((t) => ns.getServerRequiredHackingLevel(t) <= ns.getHackingLevel())
    .filter((t) => ns.getServerNumPortsRequired(t) <= programsAvailable);

  // For any that we don't have root access, crack them open
  hackedZombies
    .filter((zombie) => !ns.hasRootAccess(zombie))
    .forEach((zombie) => {
      ns.tprint(`Attempting to crack open ${zombie}`);
      ns.tprint(`It requires ${ns.getServerNumPortsRequired(zombie)} ports`);
      const failed = [...programs.entries()]
        .filter(([file]) => ns.fileExists(file))
        .map(([file, program]) => {
          ns.tprint(`Running ${file} on ${zombie}`);
          return program(zombie);
        })
        .filter((pid) => pid === 0);
      if (failed.length === 0) {
        ns.nuke(zombie);
        newlyHacked.push(zombie);
      } else {
        ns.tprint(`Failed to run a program on ${zombie}`);
      }
    });

  const target = hackedZombies
    .filter((zombie) => ns.hasRootAccess(zombie))
    .sort(
      (a, b) => ns.getServerMoneyAvailable(b) - ns.getServerMoneyAvailable(a)
    )[0];

  ns.tprint("Machines We Have Root on");
  hackedZombies.filter(ns.hasRootAccess).forEach((zombie) => {
    ns.tprint(`Potential Zombie ${zombie}`);
    ns.tprint(`\tFound via ${foundVia.get(zombie)}`);
    ns.tprint(
      `\tRequires Hacking: ${ns.getServerRequiredHackingLevel(zombie)}`
    );
    ns.tprint(`\tRequires Ports: ${ns.getServerNumPortsRequired(zombie)}`);
    ns.tprint(`\tMoney Available: ${ns.getServerMoneyAvailable(zombie)}`);
  });

  if (newlyHacked.length > 0) {
    ns.tprint(`Newly hacked servers (${newlyHacked.length})`);
    newlyHacked.forEach(ns.tprint);
  } else {
    ns.tprint("No newly hacked servers");
  }

  ns.tprint(`Most Lucrative Target is ${target}`);
}
