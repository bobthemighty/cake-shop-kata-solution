expect.extend({
  toBeDeliveredOn(received, expected) {
    if (undefined === received && undefined !== expected)
      return {
        pass: false,
        message: () =>
          `Expected ${expected.toLocaleString()} but received undefined`,
      };
    if (received.equals(expected)) return { pass: true };

    return {
      pass: false,
      message: () =>
        `Expected ${expected.toLocaleString()} but received ${received.toLocaleString()}`,
    };
  },
});
