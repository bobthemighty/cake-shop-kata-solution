import { DateArg, PlainDate, PlainDateTime } from "temporal-polyfill";

const Monday = PlainDate.from("2022-04-04");
const Tuesday = Monday.add({ days: 1 });
const Wednesday = Monday.add({ days: 2 });
const Thursday = Monday.add({ days: 3 });
const Friday = Monday.add({ days: 4 });

const following = (d: PlainDate) => d.add({ weeks: 1 });

type Size = "small" | "big";

const nextDay = (d: PlainDate) => morning(d.add({ days: 1 }));
const morning = (d: PlainDate) => d.toPlainDateTime({ hour: 9, minute: 0 });
const afternoon = (d: PlainDate) => d.toPlainDateTime({ hour: 15, minute: 0 });

const order = (size: Size, d: PlainDateTime) => {
  let leadTime = size === "small" ? 1 : 2;
  let day = d.hour < 12 ? d : d.add({ days: 1 });
  while (leadTime > 0) {
    day = day.add({ days: 1 });
    if (day.dayOfWeek < 6) leadTime--;
  }
  return day.toPlainDate();
};

test("Small cakes have a lead time of 2 days.", () => {
  expect(order("small", afternoon(Monday))).toBeDeliveredOn(Wednesday);
});

test("big cakes have a lead time of 3 days.", () => {
  expect(order("big", afternoon(Monday))).toBeDeliveredOn(Thursday);
});

test("orders received before 12pm start baking the same day", () => {
  expect(order("small", morning(Monday))).toBeDeliveredOn(Tuesday);
});

test("Marco doesn't work on weekends'", () => {
  expect(order("small", morning(Friday))).toBeDeliveredOn(following(Monday));
});
