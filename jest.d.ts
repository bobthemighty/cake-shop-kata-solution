import type {Temporal} from "temporal-polyfill"
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDelivered(received:, )
    }
  }
}
