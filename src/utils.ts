import { NS } from "@ns";
import solvers from "./contracts/solvers/index";
import ContractRecord from "./contracts/ContractRecord";

/** @param {NS} ns */
export function findHosts(ns: NS) {
  const here = ns.getHostname();
  const allHosts = ns.scan();
  const foundVia = new Map();

  const queue = [...allHosts];
  allHosts.forEach((h) => foundVia.set(h, here));
  allHosts.push(here);

  while (queue.length > 0) {
    const hopPoint = queue.shift();
    ns.scan(hopPoint)
      .filter((s) => !allHosts.includes(s))
      .forEach((s) => {
        foundVia.set(s, hopPoint);
        allHosts.push(s);
        queue.push(s);
      });
  }

  ns.print("Found Hosts");
  allHosts.forEach((h) => {
    ns.print(`\t${h}`);
    ns.print(`\tVia: ${foundVia.get(h)}`);
  });

  return {
    allHosts,
    foundVia,
  };
}

export function findContracts(ns: NS) {
  const contracts = [];

  const { allHosts } = findHosts(ns);

  for (const host of allHosts) {
    const hostContracts = ns.ls(host, ".cct");
    for (const contract of hostContracts) {
      const type = ns.codingcontract.getContractType(contract, host);
      contracts.push({ type, host, contract });
    }
  }

  return contracts;
}

/** @param {NS} ns */
export function solveContract(
  ns: NS,
  { type, host, contract }: ContractRecord
) {
  ns.print(`Found ${type} in ${contract} on ${host}`);

  const solver = solvers[type];
  if (!!solver) {
    ns.print("Solver Found");
    const data = ns.codingcontract.getData(contract, host);
    const answer = solver(ns, data);
    const result = ns.codingcontract.attempt(answer, contract, host);
    ns.print(`Contract Attempted with Result ${result}`);
  } else {
    ns.print("No solution for contract type");
  }
}

/** @param {NS} ns */
export function findTargets(ns: NS) {
  const { allHosts } = findHosts(ns);

  return allHosts
    .filter((h) => ns.getServerRequiredHackingLevel(h) <= ns.getHackingLevel())
    .filter((h) => ns.getServerMaxMoney(h) > 0)
    .filter((h) => ns.hasRootAccess(h));
}

/** @param {NS} ns */
export function findZombies(ns: NS, script: string) {
  const { allHosts } = findHosts(ns);

  return allHosts
    .filter((z) => crack(ns, z))
    .map((host) => {
      // Ensure script is on the zombie host
      ns.scp(script, host);

      // Now we can calculate threads
      return {
        host,
        threads: ramThreads(ns, script, host),
      };
    })
    .filter(({ threads }) => threads > 0);
}

/** @param {NS} ns */
export function findStrategy(ns: NS, target: string) {
  const moneyAvailable = ns.getServerMoneyAvailable(target);
  const securityLevel = ns.getServerSecurityLevel(target);

  const minMoney = ns.getServerMaxMoney(target) * 0.7;
  const maxSecurity = ns.getServerMinSecurityLevel(target) * 1.3;

  if (securityLevel > maxSecurity) {
    return "www";
  } else if (moneyAvailable < minMoney) {
    return "ggww";
  } else {
    return "wgwh";
  }
}

let pid = 0;

/** @param {NS} ns */
export function getShipsRequired(ns: NS, target: string, strategy: string) {
  const WINDOW_TIME = 100;

  const times: {
    [k: string]: number;
  } = ns.fileExists("Formulas.exe")
    ? {
        g: ns.formulas.hacking.growTime(ns.getServer(target), ns.getPlayer()),
        w: ns.formulas.hacking.weakenTime(ns.getServer(target), ns.getPlayer()),
        h: ns.formulas.hacking.hackTime(ns.getServer(target), ns.getPlayer()),
      }
    : {
        g: ns.getGrowTime(target),
        w: ns.getWeakenTime(target),
        h: ns.getHackTime(target),
      };

  let nextWindow = 0;
  let lowestStartTime = 0;
  const ships = [...strategy]
    .map((action) => {
      const timeReq = times[action];
      const startTime = nextWindow - timeReq;
      nextWindow += WINDOW_TIME;
      lowestStartTime = Math.min(lowestStartTime, startTime);
      return [action, startTime] as [string, number];
    })
    .map(([action, startTime]) => [
      action,
      target,
      startTime - lowestStartTime,
      pid++,
    ]);

  return ships;
}

export function crack(ns: NS, host: string) {
  // Do we already have root on this machine?
  if (ns.hasRootAccess(host)) return true;

  // Could we potentially hack the machine?
  if (ns.getServerRequiredHackingLevel(host) > ns.getHackingLevel())
    return false;

  const programs = [
    { file: "BruteSSH.exe", program: ns.brutessh },
    { file: "FTPCrack.exe", program: ns.ftpcrack },
    { file: "relaySMTP.exe", program: ns.relaysmtp },
    { file: "HTTPWorm.exe", program: ns.httpworm },
    { file: "SQLInject.exe", program: ns.sqlinject },
  ]
    .filter(({ file }) => ns.fileExists(file))
    .map(({ program }) => program);

  // Do we have enough programs to crack this open?
  if (ns.getServerNumPortsRequired(host) > programs.length) return false;

  programs.forEach((p) => p(host));
  ns.nuke(host);
  return true;
}

export function runScriptOnServerSingle(
  ns: NS,
  script: string,
  server: string,
  args: (string | number | boolean)[]
) {
  // Copy latest version over
  ns.scp(script, server);

  if (enoughRam(ns, script, server)) {
    ns.exec(script, server, 1, ...args);
    return true;
  }

  return false;
}

export function runScriptOnServerMaxThreads(
  ns: NS,
  script: string,
  server: string,
  args: (string | number | boolean)[]
) {
  // Copy latest version over
  ns.scp(script, server);

  // Execute the script on the server
  const threads = ramThreads(ns, script, server);
  if (threads > 0) {
    ns.exec(script, server, threads, ...args);
    return true;
  }

  ns.tprint(`Not enough RAM on server ${server} to run script ${script}`);
  return false;
}

export function enoughRam(ns: NS, script: string, server: string) {
  const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  const scriptRam = ns.getScriptRam(script, server);
  return freeRam >= scriptRam;
}

export function ramThreads(ns: NS, script: string, server: string) {
  const freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  const scriptRam = ns.getScriptRam(script, server);
  return Math.floor(freeRam / scriptRam);
}
