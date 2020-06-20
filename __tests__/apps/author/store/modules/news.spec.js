import { initialize, getters, mutations } from '@/apps/author/store/modules/news';
import Story from '@/models/Story';

describe('Author News Module', () => {
  const state = initialize();

  test('setStories should set a story in the cache', () => {
    expect(state.count).toBe(0);

    mutations.setStories(state, {
      meta: {offset: 0, count: 1},
      data: [
        new Story('1'),
      ]
    });
    expect(state.count).toBe(1);
  });

  test('getStory should get a story from the cache', () => {
    const story = getters.story(state)('1');
    expect(story.id).toBe('1');
  });
});
