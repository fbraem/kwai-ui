import moment from 'moment';
import DateAttribute from '@/js/jsonapi/DateAttribute';

describe('DateAttribute class', () => {
  test('It should return the same value', () => {
    const attr = new DateAttribute('YYYY');
    const d = moment('2020', 'YYYY');
    expect(attr.to(d)).toBe('2020');
    expect(attr.from('2020')).toEqual(d);
  });
});
