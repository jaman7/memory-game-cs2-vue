import type { VNode } from 'vue';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  ROUND = 'round',
}

export type TypeButton = 'button' | 'submit' | 'reset';
export type IButtonVariantTypes = 'primary' | 'secondary' | 'tertiary' | 'round';

export interface IButtonComponent {
  id?: string;
  key?: string;
  name?: string;
  type?: TypeButton;
  children?: string | VNode | VNode[];
  handleClick?: (e: MouseEvent) => void;
  active?: boolean;
  className?: string | string[] | Record<string, boolean>;
  tooltip?: string;
  variant?: IButtonVariantTypes;
  buttonsConfig?: IButtonComponent[];
  configCustomClass?: string;
  size?: 'xs' | 'sm' | 'lg';
  selected?: boolean;
  disabled?: boolean;
  [key: string]: any;
}
