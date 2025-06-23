import CollapsiblePanel from '@/shared/components/CollapsiblePanel/CollapsiblePanel.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('CollapsiblePanel.vue', () => {
  it('renders the title and default slot', async () => {
    const wrapper = mount(CollapsiblePanel, {
      props: {
        title: 'Test Panel',
      },
      slots: {
        default: '<div class="slot-content">Panel Content</div>',
      },
    });

    expect(wrapper.text()).toContain('Test Panel');

    expect(wrapper.find('.slot-content').isVisible()).toBe(false);

    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.slot-content').exists()).toBe(true);
  });

  it('applies size classes correctly', () => {
    const wrapper = mount(CollapsiblePanel, {
      props: {
        title: 'Sized Panel',
        size: 'lg',
      },
    });

    expect(wrapper.classes()).toContain('lg');
  });
});
