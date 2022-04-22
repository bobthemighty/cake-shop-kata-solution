import { PlainDateTime } from "temporal-polyfill";

import { Cake } from "./types";

const isMarcoWorkingDay = (d: PlainDateTime) => d.dayOfWeek < 6;
const isSandroWorkingDay = (d: PlainDateTime) =>
  false === [1, 7].includes(d.dayOfWeek);

const process =
  (
    getLeadTime: (cake: Cake) => number,
    consumeDay: (d: PlainDateTime) => boolean
  ) =>
  (cake: Cake, start: PlainDateTime) => {
    let leadTime = getLeadTime(cake);
    let deliveryDay = start;
    while (leadTime > 0) {
      deliveryDay = deliveryDay.add({ days: 1 });
      if (consumeDay(deliveryDay)) leadTime--;
    }
    return deliveryDay;
  };

const bake = process(
  (cake) => (cake.size === "small" ? 1 : 2),
  isMarcoWorkingDay
);

const frost = process(
  (cake) => (cake.extras?.includes("frosting") ? 2 : 0),
  isSandroWorkingDay
);

const addNuts = process(
  (cake) => (cake.extras?.includes("nuts") ? 1 : 0),
  isMarcoWorkingDay
);

export const box = (cake: Cake, startDay: PlainDateTime) => {
  const leadTime = cake.extras?.includes("box") ? 2 : 0;
  return startDay.add({ days: leadTime });
};

const waitForWorkingDay = (cake: Cake, startDay: PlainDateTime) => {
  let day = startDay;
  while (!isMarcoWorkingDay(day)) day = day.add({ days: 1 });
  return day;
};

const combine =
  (...args: ReturnType<typeof process>[]) =>
  (cake: Cake, d: PlainDateTime) =>
    args.reduce((start, f) => f(cake, start), d);

export const latest = (a: PlainDateTime, b: PlainDateTime) => {
  return PlainDateTime.compare(a, b) > 0 ? a : b;
};

export const makeCake = combine(waitForWorkingDay, bake, frost, addNuts);
