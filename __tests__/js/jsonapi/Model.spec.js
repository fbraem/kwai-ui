import Model from '@/js/jsonapi/Model';

class TestModel extends Model
{
  static type() {
    return 'test';
  }
}

describe('Model class', () => {
  test('It should have an id and a type', () => {
    let model = new TestModel('1');
    expect(model.id).toBe('1');
    expect(TestModel.type()).toBe('test');
  });
  test('It should have an empty fields object', () => {
    expect(TestModel.fields()).toEqual({});
  });
  test('It should have an empty relationships object', () => {
    expect(TestModel.relationships()).toEqual({});
  });
  test('It should have an empty computed object', () => {
    expect(TestModel.computed()).toEqual({});
  });
});
