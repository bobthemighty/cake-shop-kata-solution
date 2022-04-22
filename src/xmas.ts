import { PlainDate, PlainDateTime, PlainMonthDay } from "temporal-polyfill";

const XMAS_CLOSING = PlainMonthDay.from({ day: 23, month: 12 });
const XMAS_OPENING = PlainMonthDay.from({ day: 2, month: 1 });

export const isFestive = (d: PlainDateTime) => {
  const start = XMAS_CLOSING.toPlainDate({ year: d.year });
  const end = afterXmas(d);

  return PlainDate.compare(start, d) < 1 && PlainDate.compare(end, d) > -1;
};

export const afterXmas = (d: PlainDateTime) =>
  d.month === 1
    ? d.with({ day: XMAS_OPENING.day })
    : d.with({
        day: XMAS_OPENING.day,
        month: 1,
        year: d.year + 1,
      });
