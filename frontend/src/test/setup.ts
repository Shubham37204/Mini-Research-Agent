import '@testing-library/jest-dom';

// Mock ResizeObserver for TanStack Virtual
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;
