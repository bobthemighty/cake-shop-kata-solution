import { DateArg, PlainDate, PlainDateTime } from "temporal-polyfill";

type Size = "small" | "big";
type Extra = "frosting" | "box";

type Cake = {
  size: Size;
  extras?: Extra[];
};

const bake = (cake: Cake, startDay: PlainDateTime) => {
  let leadTime = cake.size === "small" ? 1 : 2;
  let deliveryDay = startDay;
  while (leadTime > 0) {
    deliveryDay = deliveryDay.add({ days: 1 });
    if (deliveryDay.dayOfWeek < 6) leadTime--;
  }
  return deliveryDay;
};

const frost = (cake: Cake, startDay: PlainDateTime) => {
  let leadTime = cake.extras?.includes("frosting") ? 2 : 0;
  let deliveryDay = startDay;
  while (leadTime > 0) {
    deliveryDay = deliveryDay.add({ days: 1 });
    if (![1, 7].includes(deliveryDay.dayOfWeek)) leadTime--;
  }
  return deliveryDay;
};

const box = (cake: Cake, startDay: PlainDateTime) => {
  const leadTime = cake.extras?.includes("box") ? 2 : 0;
  return startDay.add({ days: leadTime });
};

const latest = (a: PlainDateTime, b: PlainDateTime) => {
  return PlainDateTime.compare(a, b) > 0 ? a : b;
};

export const order = (cake: Cake, d: PlainDateTime) => {
  const startDay = d.hour < 12 ? d : d.add({ days: 1 });
  const baked = bake(cake, startDay);
  const frosted = frost(cake, baked);
  const boxed = box(cake, d);
  return latest(frosted, boxed);
};
