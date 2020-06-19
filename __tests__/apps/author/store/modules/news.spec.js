import { initialize, mutations } from '@/apps/author/store/modules/news';
import Story from '@/models/Story';

describe('Author News Module', () => {
  test('setStories updates state', () => {
    const state = initialize();
    expect(state.count).toBe(0);

    mutations.setStories(state, {
      meta: { offset: 0, count: 1},
      data: [
        new Story('1'),
      ]
    });
    expect(state.count).toBe(1);
  });
});
