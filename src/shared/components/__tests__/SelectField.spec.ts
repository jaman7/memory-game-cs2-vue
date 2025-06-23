import SelectField from '@/shared/components/SelectField/SelectField.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

const options = [
  { id: 1, displayName: 'Opcja 1' },
  { id: 2, displayName: 'Opcja 2' },
  { id: 3, displayName: 'Opcja 3' },
];

describe('SelectField.vue', () => {
  it('renderuje label, select i description', () => {
    const wrapper = mount(SelectField, {
      props: {
        id: 'select-id',
        label: 'Wybierz opcję',
        description: 'Opis pola',
        describedby: 'opis-id',
        modelValue: 2,
        options,
      },
    });

    expect(wrapper.find('label').text()).toBe('Wybierz opcję');
    expect(wrapper.find('select').attributes('aria-describedby')).toBe('opis-id');
    expect(wrapper.findAll('option')).toHaveLength(3);
    expect(wrapper.find('p.select-description').text()).toBe('Opis pola');
  });

  it('wyświetla poprawną początkową wartość selecta', () => {
    const wrapper = mount(SelectField, {
      props: {
        id: 'select-id',
        label: 'Opcje',
        modelValue: 3,
        options,
      },
    });

    const select = wrapper.find('select');
    expect((select.element as HTMLSelectElement).value).toBe('3');
  });

  it('emituje update:modelValue przy zmianie wartości', async () => {
    const wrapper = mount(SelectField, {
      props: {
        id: 'select-id',
        label: 'Opcje',
        modelValue: 1,
        options,
      },
    });

    const select = wrapper.find('select');
    await select.setValue('2');

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue']![0]).toEqual([2]);
  });

  it('nie renderuje opisu, jeśli nie jest podany', () => {
    const wrapper = mount(SelectField, {
      props: {
        id: 'select-id',
        label: 'Bez opisu',
        modelValue: 1,
        options,
      },
    });

    expect(wrapper.find('.select-description').exists()).toBe(false);
  });
});
