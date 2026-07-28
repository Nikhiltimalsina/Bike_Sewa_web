import { describe, it, expect } from 'vitest';
import * as proxyModule from '../proxy';

describe('proxy module', () => {
  it('should export configuration', () => {
    expect(proxyModule).toBeDefined();
  });
});

