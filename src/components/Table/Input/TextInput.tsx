import React from 'react';

import styles from '../Table.module.css';

interface IProps {
  classNames: string;
  value: string;
  onChange: (e: any) => void;
  onBlur: () => void;
  errorMessage: string;
}

export function TextInput({
  classNames,
  value,
  onChange,
  onBlur,
  errorMessage,
}: IProps) {
  return (
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
  );
}
