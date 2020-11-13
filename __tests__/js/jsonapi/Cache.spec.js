import Cache from '@/js/jsonapi/Cache';
import Model from '@/js/jsonapi/Model';

class TestModel extends Model
{
  static type() {
    return 'test';
  }
}

describe('Cache class', () => {
  test('It should cache an object', () => {
    let cache = new Cache();
    let model = cache.getModel(TestModel, '1');
    expect(model.constructor.type()).toBe('test');
    model.name = 'test';
    let cachedModel = cache.getModel(TestModel, '1');
    expect(model).toEqual(cachedModel);
    cachedModel.name = 'changed';
    expect(model.name).toBe('changed');
  });
});
