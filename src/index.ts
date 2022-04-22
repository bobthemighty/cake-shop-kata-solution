import {
  DateArg,
  PlainDate,
  PlainDateTime,
  PlainMonthDay,
} from "temporal-polyfill";

type Size = "small" | "big";
type Extra = "frosting" | "box" | "nuts";

type Cake = {
  size: Size;
  extras?: Extra[];
};

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

const box = (cake: Cake, startDay: PlainDateTime) => {
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

const latest = (a: PlainDateTime, b: PlainDateTime) => {
  return PlainDateTime.compare(a, b) > 0 ? a : b;
};

const XMAS_CLOSING = PlainMonthDay.from({ day: 23, month: 12 });
const XMAS_OPENING = PlainMonthDay.from({ day: 2, month: 1 });

const isFestive = (d: PlainDateTime) => {
  const start = XMAS_CLOSING.toPlainDate({ year: d.year });
  const end = XMAS_OPENING.toPlainDate({ year: 1 + d.year });

  return PlainDate.compare(start, d) < 1 && PlainDate.compare(end, d) > -1;
};

export const order = (cake: Cake, d: PlainDateTime) => {
  const startDay = d.hour < 12 ? d : d.add({ days: 1 });
  const makeCake = combine(waitForWorkingDay, bake, frost, addNuts);
  const bakedDay = makeCake(cake, startDay);
  let deliveryDay = latest(bakedDay, box(cake, d));

  if (isFestive(deliveryDay))
    deliveryDay = makeCake(
      cake,
      XMAS_OPENING.toPlainDate({ year: 1 + d.year })
    );

  return deliveryDay;
};
