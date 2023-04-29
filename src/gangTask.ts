import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const [task = "Ethical Hacking"] = ns.args as [string];

  const memberNames = ns.gang.getMemberNames();
  memberNames.forEach((member) => {
    ns.gang.setMemberTask(member, task);
  });
}
