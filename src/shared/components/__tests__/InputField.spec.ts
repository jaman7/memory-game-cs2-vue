import InputField from '@/shared/components/InputField/InputField.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('InputField.vue', () => {
  it('renderuje etykietę, placeholder i opis', () => {
    const wrapper = mount(InputField, {
      props: {
        id: 'test-id',
        label: 'Testowa etykieta',
        placeholder: 'Wpisz coś...',
        description: 'Opis pola',
        describedby: 'opis-id',
        modelValue: '',
      },
    });

    expect(wrapper.find('label').text()).toBe('Testowa etykieta');
    expect(wrapper.find('input').attributes('placeholder')).toBe('Wpisz coś...');
    expect(wrapper.find('p.input-description').exists()).toBe(true);
    expect(wrapper.find('p.input-description').text()).toBe('Opis pola');
    expect(wrapper.find('input').attributes('aria-describedby')).toBe('opis-id');
  });

  it('wyświetla wartość z modelValue', () => {
    const wrapper = mount(InputField, {
      props: {
        id: 'test-id',
        label: 'Test',
        modelValue: 'początkowa wartość',
      },
    });

    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('początkowa wartość');
  });

  it('emituje update:modelValue po edycji', async () => {
    const wrapper = mount(InputField, {
      props: {
        id: 'test-id',
        label: 'Test',
        modelValue: '',
      },
    });

    const input = wrapper.find('input');
    await input.setValue('nowa wartość');

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue']![0]).toEqual(['nowa wartość']);
  });

  it('nie renderuje opisu, jeśli nie został podany', () => {
    const wrapper = mount(InputField, {
      props: {
        id: 'test-id',
        label: 'Bez opisu',
        modelValue: '',
      },
    });

    expect(wrapper.find('.input-description').exists()).toBe(false);
  });
});
