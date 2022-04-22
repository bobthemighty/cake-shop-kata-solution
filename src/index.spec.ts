import { DateArg, PlainDate, PlainDateTime } from "temporal-polyfill";

const Monday = PlainDate.from("2022-04-04");
const Tuesday = Monday.add({ days: 1 });
const Wednesday = Monday.add({ days: 2 });
const Thursday = Monday.add({ days: 3 });
const Friday = Monday.add({ days: 4 });

const following = (d: PlainDate) => d.add({ weeks: 1 });

type Size = "small" | "big";
type Extra = "frosting";

type Cake = {
  size: Size;
  extras?: Extra[];
};

const nextDay = (d: PlainDate) => morning(d.add({ days: 1 }));
const morning = (d: PlainDate) => d.toPlainDateTime({ hour: 9, minute: 0 });
const afternoon = (d: PlainDate) => d.toPlainDateTime({ hour: 15, minute: 0 });

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

const order = (cake: Cake, d: PlainDateTime) => {
  const startDay = d.hour < 12 ? d : d.add({ days: 1 });
  const baked = bake(cake, startDay);
  const frosted = frost(cake, baked);
  return frosted;
};

test("Small cakes have a lead time of 2 days.", () => {
  expect(order({ size: "small" }, afternoon(Monday))).toBeDeliveredOn(
    Wednesday
  );
});

test("big cakes have a lead time of 3 days.", () => {
  expect(order({ size: "big" }, afternoon(Monday))).toBeDeliveredOn(Thursday);
});

test("orders received before 12pm start baking the same day", () => {
  expect(order({ size: "small" }, morning(Monday))).toBeDeliveredOn(Tuesday);
});

test("Custom frosting adds two days", () => {
  expect(
    order({ size: "small", extras: ["frosting"] }, morning(Monday))
  ).toBeDeliveredOn(Thursday);
});

test("Marco doesn't work on weekends'", () => {
  expect(order({ size: "small" }, morning(Friday))).toBeDeliveredOn(
    following(Monday)
  );

  expect(
    order({ size: "small", extras: ["frosting"] }, morning(Friday))
  ).toBeDeliveredOn(following(Wednesday));
});

test("Sandro works Tuesday -> Saturday", () => {
  expect(
    order(
      {
        size: "big",
        extras: ["frosting"],
      },
      afternoon(Tuesday)
    )
  ).toBeDeliveredOn(following(Tuesday));
});
