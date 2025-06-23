import Button from '@/shared/components/Button/Button.vue';
import { mount } from '@vue/test-utils';
import { OhVueIcon } from 'oh-vue-icons';
import { describe, expect, it } from 'vitest';

describe('Button.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    });
    expect(wrapper.text()).toBe('Click me');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('renders icon passed via children', () => {
    const wrapper = mount(Button, {
      props: {
        buttonsConfig: [
          {
            id: 'test',
            children: h(OhVueIcon, { name: 'fa-check' }),
          },
        ],
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('accepts aria-label and type attributes', () => {
    const wrapper = mount(Button, {
      attrs: {
        'aria-label': 'Confirm',
        type: 'submit',
      },
      slots: { default: 'Submit' },
    });
    expect(wrapper.attributes('aria-label')).toBe('Confirm');
    expect(wrapper.attributes('type')).toBe('submit');
  });
});
