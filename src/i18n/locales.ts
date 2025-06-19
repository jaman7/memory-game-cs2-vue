export interface LocaleOption {
  code: string;
  label: string;
  flag: string;
}

export const localeOptions: LocaleOption[] = [
  { code: 'pl', label: 'Polski', flag: '/icons/flags/pl.svg' },
  { code: 'en', label: 'English', flag: '/icons/flags/en.svg' },
];
