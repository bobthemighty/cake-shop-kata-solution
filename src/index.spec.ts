import { PlainDate, PlainDateTime } from "temporal-polyfill";

const Monday = PlainDateTime.from("2022-04-04");
const Tuesday = Monday.add({ days: 1 });
const Wednesday = Monday.add({ days: 2 });
const Thursday = Monday.add({ days: 3 });

const order = (x, d: PlainDateTime) => {
  const leadTime = x === "small" ? 2 : 3;
  return d.add({ days: leadTime });
};

test("Small cakes have a lead time of 2 days.", () => {
  expect(order("small", Monday)).toBeDeliveredOn(Wednesday);
});

test("big cakes hav ea lead time of 3 days.", () => {
  expect(order("big", Monday)).toBeDeliveredOn(Thursday);
});
