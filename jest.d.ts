import type { DateArg } from "temporal-polyfill";
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDelivered(expected: DateArg): CustomMatcherResult;
    }
  }
}
