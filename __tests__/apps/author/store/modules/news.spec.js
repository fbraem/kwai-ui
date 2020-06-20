import {
  initialize, getters, mutations /*, actions */
} from '@/apps/author/store/modules/news';
import Story from '@/models/Story';

/*
import Transformer from '@/js/jsonapi/Transformer';
const data = {
  meta: {
    count: 1,
    offset: 0
  },
  data: {
    type: 'stories',
    id: '1',
    attributes: {
      publish_date: '2020-01-01 12:00:00'
    }
  }
};
const story = new Transformer().deserialize(Story, data);

jest.mock('@/js/http', () => ({
  __esModule: true,
  http_api: {
    url: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue({
      meta: {
        count: 1,
        offset: 0
      },
      data: {
        type: 'stories',
        id: '1',
        attributes: {
          publish_date: '2020-01-01 12:00:00'
        }
      }
    })
  }
}));
*/

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

  test('reset mutation should initialize state', () => {
    mutations.reset(state);
    expect(state.count).toBe(0);
  });

/*
  test('load action should load stories', () => {
    mutations.reset(state);
    const commit = jest.fn();
    const dispatch = jest.fn();
    actions.load({ state, commit, dispatch }, { offset: 0 });
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(commit).toHaveBeenCalledWith('setStories', {
      meta: { count: 1, offset: 0 }, data: story
    });
  });
*/
});
