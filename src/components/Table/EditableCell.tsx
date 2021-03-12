import React, { useEffect, useState } from 'react';
import { Row } from 'react-table';
import ReactFlagsSelect from 'react-flags-select';

import styles from './Table.module.css';
import { IColumn } from './Table';

export const getRowErrorStatus = (
  validations: {
    [key: string]: (value: string, originalRow?: any) => string;
  },
  data: any
) => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (validations[key]) {
        if (validations[key](value, data)) {
          return true;
        }
      }
    }
  }

  return false;
};

export const EditableCell = ({
  value: initialValue,
  row: { index, original },
  column: { id, type, countryCodeAccessor, datalist, validation },
  onCellChange,
  validations,
}: {
  value: string;
  row: Row<any>;
  column: IColumn;
  onCellChange: (
    id: any,
    fieldName: string,
    value: string,
    rowValid: boolean
  ) => void;
  validations: {
    [key: string]: (value: string, originalRow?: any) => string;
  };
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    original[countryCodeAccessor as string] || 'US'
  );
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState(
    validation ? validation(initialValue, original) : ''
  );

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setErrorMessage(validation ? validation(value || '', original) : '');
    onCellChange(
      original.id,
      id as string,
      value,
      !getRowErrorStatus(validations, { ...original, [id || '']: value })
    );
  };

  const onCountryCodeChange = (code: string) => {
    setSelectedCountryCode(code);
    setErrorMessage(validation ? validation(value || '', original) : '');
    onCellChange(
      original.id,
      countryCodeAccessor as string,
      code,
      !getRowErrorStatus(validations, {
        ...original,
        [countryCodeAccessor || '']: code,
      })
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setErrorMessage(validation ? validation(initialValue, original) : '');
  }, [validations]);

  const classNames = errorMessage
    ? `${styles.Input} ${styles.InputError}`
    : styles.Input;

  if (datalist) {
    return (
      <div className={styles.AutoComplete}>
        <input
          className={classNames}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          list={id}
        />
        <datalist id={id}>
          {datalist.map((item, key) => (
            <option key={key} value={item} />
          ))}
        </datalist>
      </div>
    );
  }

  if (type === 'phone') {
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
};
