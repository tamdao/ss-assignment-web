import React from 'react';
import ReactFlagsSelect from 'react-flags-select';

import styles from '../Table.module.css';

interface IProps {
  selectedCountryCode: any;
  onCountryCodeChange: (code: string) => void;
  classNames: string;
  value: string;
  onChange: (e: any) => void;
  onBlur: () => void;
  errorMessage: string;
}

export function PhoneInput({
  selectedCountryCode,
  onCountryCodeChange,
  classNames,
  value,
  onChange,
  onBlur,
  errorMessage,
}: IProps) {
  return (
    <div className={styles.PhoneContainer}>
      <ReactFlagsSelect
        showOptionLabel={false}
        showSelectedLabel={false}
        selected={selectedCountryCode}
        onSelect={onCountryCodeChange}
        className={styles.FlagsSelect}
      />
      <div className={styles.TooltipContainer}>
        <input
          className={classNames}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {errorMessage && (
          <span className={styles.TooltipText}>{errorMessage}</span>
        )}
      </div>
    </div>
  );
}
