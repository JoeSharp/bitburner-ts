import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const [action, target, delay, pid] = ns.args as [
    string,
    string,
    number,
    number
  ];

  ns.print(
    `Doing action ${action} on ${target} after ${delay} ms with PID: ${pid}`
  );

  await ns.sleep(delay);

  switch (action) {
    case "g":
      await ns.grow(target);
      break;
    case "w":
      await ns.weaken(target);
      break;
    default: // Hack
      await ns.hack(target);
      break;
  }
}
