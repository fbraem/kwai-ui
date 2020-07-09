import { mount } from '@vue/test-utils';
import Paginator from '@/components/Paginator';

describe('Paginator', () => {
  const props = {
    limit: 10, offset: 0, count: 100
  };

  it('renders paginator', () => {
    const wrapper = mount(
      Paginator, { propsData: props });
    expect(wrapper.findComponent(Paginator).exists()).toBe(true);
  });

  it('counts pages', () => {
    expect(Paginator.computed.pageCount.call(props)).toBe(10);
    expect(Paginator.computed.pageCount.call({
      limit: 10, offset: 0, count: 8
    })).toBe(1);
  });

  it('sets the current page', () => {
    expect(Paginator.computed.currentPage.call(props)).toBe(1);
    expect(Paginator.computed.currentPage.call({
      limit: 10, offset: 1, count: 20
    })).toBe(2);
  });

});
