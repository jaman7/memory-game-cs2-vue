<template>
  <template v-if="!props.buttonsConfig?.length">
    <button
      :type="props.type || 'button'"
      :class="buttonClasses"
      :disabled="props.disabled"
      :aria-label="computedAriaLabel ?? ''"
      v-bind="restAttrs"
      @click="props.handleClick"
    >
      <slot>
        <template v-if="(props?.name ?? '').length > 0">
          {{ $t(props.name || '') }}
        </template>
      </slot>
    </button>
  </template>

  <template v-else>
    <div :class="props.configCustomClass ?? 'flex gap-8'">
      <button
        v-for="(btn, i) in props.buttonsConfig"
        :key="btn.id || btn.name || `btn-${i}`"
        :type="btn.type || 'button'"
        :class="getButtonClasses(btn)"
        :disabled="btn.disabled ?? false"
        :aria-label="getAriaLabel(btn)"
        v-bind="getRestAttrs(btn)"
        @click="btn.handleClick"
      >
        <template v-if="btn.name">
          {{ $t(btn.name) }}
        </template>
        <template v-else-if="btn.children">
          <component :is="btn.children" />
        </template>
      </button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { isValidAttribute } from '@/shared/utils/safeAttributes';
import { clsx } from 'clsx';
import { computed, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';
import type { IButtonComponent } from './Button.model';

const props = defineProps<IButtonComponent>();
const restAttrs = useAttrs();
const { t } = useI18n();

const computedAriaLabelFallback = computed(() => ((props.name ?? '').length > 0 ? t(props.name || '') : 'Unnamed Button'));

const computedAriaLabel = computed(() => {
  const hasLabelledBy = 'aria-labelledby' in restAttrs && !!restAttrs['aria-labelledby'];
  return !hasLabelledBy ? String(restAttrs['aria-label'] ?? computedAriaLabelFallback.value) : '';
});

const getButtonClasses = (btn: IButtonComponent) => {
  const variantClasses = {
    primary: 'primary',
    secondary: 'secondary',
    tertiary: 'tertiary',
    round: 'round rounded-full',
  };

  const sizeClasses = {
    xs: btn.variant === 'round' ? 'text-sm h-6 w-6' : 'text-xs px-1 py-1',
    sm: btn.variant === 'round' ? 'text-base h-8 w-8' : 'text-sm px-3 py-2',
    lg: btn.variant === 'round' ? 'text-xl h-12 w-12' : 'text-base px-4 py-3',
  };

  return clsx([
    'button-component',
    variantClasses[btn.variant || 'primary'],
    sizeClasses[btn.size || 'sm'],
    btn.disabled ? 'bg-gray text-disabled cursor-not-allowed' : '',
    typeof btn.className === 'string' ? btn.className : clsx(btn.className),
    { active: btn.active },
  ]);
};

const buttonClasses = computed(() => getButtonClasses(props));

const getAriaLabel = (btn: IButtonComponent) => {
  const hasLabelledBy = 'aria-labelledby' in btn && !!btn['aria-labelledby'];
  return !hasLabelledBy ? (btn['aria-label'] ?? (btn.name ? t(btn.name) : 'Unnamed Button')) : undefined;
};

const getRestAttrs = (btn: IButtonComponent) => {
  const {
    id,
    key,
    name,
    type,
    handleClick,
    active,
    className,
    tooltip,
    variant,
    buttonsConfig,
    configCustomClass,
    size,
    selected,
    disabled,
    children,
    ...rest
  } = btn;

  const safeAttrs: Record<string, any> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (isValidAttribute(k)) {
      safeAttrs[k] = v;
    }
  }
  return safeAttrs;
};
</script>
