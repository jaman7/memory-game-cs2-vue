import Spinner from '@/shared/components/Spinner/Spinner.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Spinner.vue', () => {
  it('renderuje domyślny spinner z poprawnymi domyślnymi propsami i atrybutami', () => {
    const wrapper = mount(Spinner);
    const outerDiv = wrapper.find('.spinner');
    expect(outerDiv.exists()).toBe(true);
    expect(outerDiv.attributes('role')).toBe('status');
    expect(outerDiv.attributes('aria-busy')).toBe('true');
    expect(outerDiv.attributes('aria-label')).toBe('Loading...');
    const text = wrapper.find('.spinner-text');
    expect(text.exists()).toBe(true);
    expect(text.text()).toBe('Loading...');
    const loader = wrapper.find('.spinner-loader');
    expect(loader.exists()).toBe(true);
    const style = loader.attributes('style');
    expect(style).toContain('width: 40px');
    expect(style).toContain('height: 40px');
    expect(style).toContain('border: 4px solid rgb(0, 123, 255)');
    expect(style).toContain('border-top-color: transparent');
    expect(style).toContain('border-radius: 50%');
  });

  it('renderuje spinner z rozmiarem "small" i odpowiednio aktualizuje style', () => {
    const wrapper = mount(Spinner, {
      props: { size: 'small' },
    });
    const loaderStyle = wrapper.get('.spinner-loader').attributes('style');
    expect(loaderStyle).toContain('width: 20px');
    expect(loaderStyle).toContain('height: 20px');
    expect(loaderStyle).toContain('border: 4px solid rgb(0, 123, 255)');
  });

  it('renderuje spinner z rozmiarem "large" i odpowiednio aktualizuje style', () => {
    const wrapper = mount(Spinner, {
      props: { size: 'large' },
    });
    const loaderStyle = wrapper.get('.spinner-loader').attributes('style');
    expect(loaderStyle).toContain('width: 60px');
    expect(loaderStyle).toContain('height: 60px');
    expect(loaderStyle).toContain('border: 4px solid rgb(0, 123, 255)');
  });

  it('ustawia niestandardowy kolor obramowania gdy prop "color" jest podany', () => {
    const wrapper = mount(Spinner, {
      props: { color: '#ff0000' },
    });
    const loaderStyle = wrapper.get('.spinner-loader').attributes('style');
    expect(loaderStyle).toContain('width: 40px');
    expect(loaderStyle).toContain('height: 40px');
    expect(loaderStyle).toContain('border: 4px solid rgb(255, 0, 0)');
    expect(loaderStyle).toContain('border-top-color: transparent');
  });

  it('ustawia niestandardowy ariaLabel i odzwierciedla go w atrybucie aria-label oraz tekście', () => {
    const wrapper = mount(Spinner, {
      props: { ariaLabel: 'Please wait' },
    });
    const outerDiv = wrapper.get('.spinner');
    expect(outerDiv.attributes('aria-label')).toBe('Please wait');
    expect(wrapper.get('.spinner-text').text()).toBe('Please wait');
    expect(outerDiv.attributes('role')).toBe('status');
    expect(outerDiv.attributes('aria-busy')).toBe('true');
  });

  it('zawiera poprawne atrybuty ARIA dla dostępności', () => {
    const wrapper = mount(Spinner);
    const outerDiv = wrapper.get('.spinner');
    expect(outerDiv.attributes('role')).toBe('status');
    expect(outerDiv.attributes('aria-busy')).toBe('true');
    expect(outerDiv.attributes('aria-label')).toBe('Loading...');
  });
});
