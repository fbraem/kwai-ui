import Attribute from '@/js/jsonapi/Attribute';
import ArrayAttribute from '@/js/jsonapi/ArrayAttribute';
import ObjectAttribute from '@/js/jsonapi/ObjectAttribute';

describe('ArrayAttribute class', () => {
  test('It should return the same array', () => {
    const attr = new ArrayAttribute(
      new Attribute()
    );
    const authors = [
      'Eric Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides',
    ];
    expect(attr.to(authors)).toEqual([
      'Eric Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides',
    ]);
    expect(attr.from([
      'Eric Gamma', 'Richard Helm', 'Ralph Johnson', 'John Vlissides',
    ])).toEqual(authors);
  });

  test('It should return the same array with an object', () => {
    const attr = new ArrayAttribute(
      new ObjectAttribute({
        name: new Attribute()
      })
    );
    const authors = [
      { name: 'Eric Gamma' },
      { name: 'Richard Helm' },
      { name: 'Ralph Johnson' },
      { name: 'John Vlissides' },
    ];
    expect(attr.to(authors)).toEqual([
      { name: 'Eric Gamma' },
      { name: 'Richard Helm' },
      { name: 'Ralph Johnson' },
      { name: 'John Vlissides' },
    ]);
    expect(attr.from([
      { name: 'Eric Gamma' },
      { name: 'Richard Helm' },
      { name: 'Ralph Johnson' },
      { name: 'John Vlissides' },
    ])).toEqual(authors);
  });
});
