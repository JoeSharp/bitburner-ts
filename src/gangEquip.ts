import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const memberNames = ns.gang.getMemberNames();

  if (ns.gang.canRecruitMember()) {
    ns.gang.recruitMember(`BadGuy-${memberNames.length + 1}`);
  }

  const equipmentList = ns.gang.getEquipmentNames().map((name) => ({
    name,
    type: ns.gang.getEquipmentType(name),
    cost: ns.gang.getEquipmentCost(name),
    stats: ns.gang.getEquipmentStats(name),
  }));

  memberNames
    .map((n) => ns.gang.getMemberInformation(n))
    .forEach((member) => {
      equipmentList.forEach((equipment) => {
        if (!!equipment.stats.hack && equipment.stats.hack > 0) {
          ns.gang.purchaseEquipment(member.name, equipment.name);
        }
      });
      // ["DataJack", "Neuralstimulator", "BitWire"].forEach(aug=>
      //   ns.gang.purchaseEquipment(member.name, aug))
      // ;
    });
}
