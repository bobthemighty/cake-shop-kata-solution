import { PlainDateTime } from "temporal-polyfill";

import { box, latest, makeCake } from "./process";
import { Cake } from "./types";
import { afterXmas, isFestive } from "./xmas";

export const order = (cake: Cake, d: PlainDateTime) => {
  const startDay = d.hour < 12 ? d : d.add({ days: 1 });
  const bakedDay = makeCake(cake, startDay);
  let deliveryDay = latest(bakedDay, box(cake, d));

  if (isFestive(deliveryDay))
    deliveryDay = makeCake(cake, afterXmas(deliveryDay));

  return deliveryDay;
};
