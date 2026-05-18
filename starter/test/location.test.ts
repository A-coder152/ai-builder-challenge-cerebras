import { describe, it, expect } from 'vitest';
import { parseLocation } from '../lib/location';

describe('location parsing', () => {
  it('correctly parses rack strings', () => {
    expect(parseLocation('rack:SFO/R201/A/K1/10')).toEqual({
      site: 'SFO',
      room: 'R201',
      row: 'A',
      rack: 'K1',
      ru: '10'
    });
  });

  it('returns null for invalid strings', () => {
    expect(parseLocation('not-a-rack')).toBeNull();
    expect(parseLocation('rack:incomplete/path')).toBeNull();
  });
});
