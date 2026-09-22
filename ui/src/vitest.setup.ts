import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

Object.defineProperty(window, 'PointerEvent', {
  configurable: true,
  value: MouseEvent,
});

afterEach(cleanup);
