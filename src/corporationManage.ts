import { NS } from "@ns";

const MATERIAL_ENERGY = "Energy";
const MATERIAL_HARDWARE = "Hardware";

/** @param {NS} ns */
export async function main(ns: NS) {
  const CITY = "Sector-12";
  const DIVISION = "Code Monkeys";

  while (true) {
    const warehouse = ns.corporation.getWarehouse(DIVISION, CITY);

    const thirdOfWarehouse = warehouse.size / 3;

    // Ensure we have proportions of energy and hardware
    [MATERIAL_ENERGY, MATERIAL_HARDWARE].forEach((material) => {
      const currentStock = ns.corporation.getMaterial(DIVISION, CITY, material);

      if (currentStock.qty < thirdOfWarehouse) {
        ns.corporation.buyMaterial(DIVISION, CITY, material, 4);
      } else {
        ns.corporation.buyMaterial(DIVISION, CITY, material, 0);
      }
    });

    await ns.sleep(2000);
  }
}
