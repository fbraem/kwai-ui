import Attribute from '@/js/jsonapi/Attribute';

describe('Attribute class', () => {
  test('It should return the same value', () => {
    const attr = new Attribute();
    expect(attr.to('1')).toBe('1');
    expect(attr.from('2')).toBe('2');
  });
});
