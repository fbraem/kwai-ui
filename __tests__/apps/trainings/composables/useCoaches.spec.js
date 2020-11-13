import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import createCoachService from '@/apps/trainings/composables/useCoaches';
import { coach, coaches } from '__fixtures__/coaches';
import Coach from '@/models/trainings/Coach';

describe('Coaches Service', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('should get all coaches', async() => {
    fetch.once(JSON.stringify(coaches));

    const service = createCoachService();
    // Run load twice, to see if the cached value is used
    await service.load.run();
    await service.load.run();
    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith('api/trainings/coaches', expect.anything());
  });

  test('should reload all coaches', async() => {
    fetch.once(JSON.stringify(coaches));

    const service = createCoachService();
    await service.load.run();
    await service.load.run(true);
    expect(fetch).toBeCalledTimes(2);
  });

  test('should read a coach', async() => {
    fetch.once(JSON.stringify(coach));

    const service = createCoachService();
    // Run read twice, to see if the cached value is used
    await service.read.run('1');
    await service.read.run('1');

    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith('api/trainings/coaches/1', expect.anything());

    expect(service.current.value).toHaveProperty('id');
    expect(service.current.value.active).toBe(true);
  });

  test('save should call POST for create', async() => {
    const service = createCoachService();

    const coach = new Coach();
    coach.description = 'New Coach';
    await service.save.run(coach);

    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(
      'api/trainings/coaches',
      expect.objectContaining({method: 'POST'})
    );
  });

  test('save should call PATCH for update', async() => {
    const service = createCoachService();

    const coach = new Coach('1');
    coach.description = 'New Coach';
    await service.save.run(coach);

    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith(
      'api/trainings/coaches/1',
      expect.objectContaining({ method: 'PATCH'})
    );
  });
});
