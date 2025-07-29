// Test setup file
beforeAll(() => {
  // Global test setup
});

afterAll(() => {
  // Global test cleanup
});

// Extend Jest matchers if needed
declare global {
  namespace jest {
    interface Matchers<R> {
      // Custom matchers can be added here
    }
  }
}