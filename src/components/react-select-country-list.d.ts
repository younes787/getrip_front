// react-select-country-list.d.ts
declare module 'react-select-country-list' {
    const countryList: {
      getData: () => Array<{ label: string; value: string }>;
    };
    export default function (): typeof countryList;
  }
  