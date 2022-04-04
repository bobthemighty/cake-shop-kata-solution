import type { DateArg } from "temporal-polyfill";
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDeliveredOn(received: DateArg, expected: DateArg);
    }
  }
}
