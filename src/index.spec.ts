import { DateArg, PlainDate, PlainDateTime } from "temporal-polyfill";

import { order } from ".";

const Monday = PlainDate.from("2022-04-04");
const Tuesday = Monday.add({ days: 1 });
const Wednesday = Monday.add({ days: 2 });
const Thursday = Monday.add({ days: 3 });
const Friday = Monday.add({ days: 4 });

const morning = (d: PlainDate) => d.toPlainDateTime({ hour: 9, minute: 0 });
const afternoon = (d: PlainDate) => d.toPlainDateTime({ hour: 15, minute: 0 });

const following = (d: PlainDate) => d.add({ weeks: 1 });

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

test("An order for a small cake with a fancy box, placed on Monday morning, has a delivery date of Wednesday ", () => {
  expect(
    order({ size: "small", extras: ["box"] }, morning(Monday))
  ).toBeDeliveredOn(Wednesday);
});

test("An order for a big cake with a fancy box, placed on Monday morning, has a delivery date of Wednesday", () => {
  expect(
    order({ size: "big", extras: ["box"] }, morning(Monday))
  ).toBeDeliveredOn(Wednesday);
});

test("An order for a big cake with a fancy box, placed on Monday afternoon, has a delivery date of Thursday", () => {
  expect(
    order({ size: "big", extras: ["box"] }, afternoon(Monday))
  ).toBeDeliveredOn(Thursday);
});

test("An order for a small cake with nuts placed on Monday morning has a delivery date of Wednesday", () => {
  expect(
    order({ size: "small", extras: ["nuts"] }, morning(Monday))
  ).toBeDeliveredOn(Wednesday);
});

test("An order for a small cake with frosting placed on Monday morning has a delivery date of Friday", () => {
  expect(
    order({ size: "small", extras: ["nuts", "frosting"] }, morning(Monday))
  ).toBeDeliveredOn(Friday);
});

test("An order for a small cake with frosting, in a fancy box, placed on Tuesday morning, has a delivery date of Monday ", () => {
  expect(
    order(
      { size: "small", extras: ["nuts", "frosting", "box"] },
      morning(Tuesday)
    )
  ).toBeDeliveredOn(following(Monday));
});
