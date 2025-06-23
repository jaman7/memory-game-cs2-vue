import LazyImage from '@/shared/components/LazyImage/LazyImage.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('LazyImage.vue', () => {
  it('renders a placeholder initially', () => {
    const wrapper = mount(LazyImage, {
      props: { src: 'https://example.com/image.jpg', alt: 'Example Image' },
    });

    expect(wrapper.find('[data-testid="lazy-placeholder"]').exists()).toBe(true);
    expect(wrapper.find('img').classes()).toContain('lazyloading');
  });

  it('displays default logo if src is null or error occurs', async () => {
    const wrapper = mount(LazyImage, {
      props: { src: null, alt: 'No Image' },
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toContain('No_image_available.svg');

    await img.trigger('error');
    expect(img.attributes('src')).toContain('No_image_available.svg');
  });

  it('sets alt and id attributes properly', () => {
    const wrapper = mount(LazyImage, {
      props: { id: 'test-img', src: 'https://example.com/image.jpg', alt: 'Alt Text' },
    });

    const img = wrapper.find('img');
    expect(img.attributes('alt')).toBe('Alt Text');
    expect(img.attributes('id')).toBe('test-img');
  });

  it('calls onClick handler when image is clicked', async () => {
    const onClick = vi.fn();
    const wrapper = mount(LazyImage, {
      props: { src: 'https://example.com/image.jpg', onClick },
    });

    await wrapper.find('img').trigger('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('adds lazyloaded class when image loads', async () => {
    const wrapper = mount(LazyImage, {
      props: { src: 'https://example.com/image.jpg' },
    });

    await wrapper.find('img').trigger('load');
    expect(wrapper.find('img').classes()).toContain('lazyloaded');
  });
});
