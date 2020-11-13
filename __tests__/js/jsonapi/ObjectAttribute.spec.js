import Attribute from '@/js/jsonapi/Attribute';
import ObjectAttribute from '@/js/jsonapi/ObjectAttribute';

describe('ObjectAttribute class', () => {
  test('It should return the same value', () => {
    const attr = new ObjectAttribute({
      title: new Attribute()
    });
    const book = {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software'
    };
    expect(attr.to(book)).toEqual({
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software'
    });
    expect(attr.from({
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software'
    })).toEqual(book);
  });
});
