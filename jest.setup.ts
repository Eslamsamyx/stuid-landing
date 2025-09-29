// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock libraries - see __mocks__ folder for implementation
jest.mock('framer-motion');
jest.mock('qrcode.react');
jest.mock('lucide-react');

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []

  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

global.IntersectionObserver = MockIntersectionObserver as any

// Mock window.scrollTo
window.scrollTo = jest.fn()

// Mock window.scrollIntoView
Element.prototype.scrollIntoView = jest.fn()

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})