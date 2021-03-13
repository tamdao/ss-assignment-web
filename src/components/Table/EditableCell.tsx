import React, { useEffect, useState } from 'react';
import { Row } from 'react-table';
import ReactFlagsSelect from 'react-flags-select';

import styles from './Table.module.css';
import { IColumn } from './Table';
import { TextInput } from './Input/TextInput';
import { PhoneInput } from './Input/PhoneInput';
import { ListInput } from './Input/ListInput';

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
  }, [validations, validation, initialValue, original]);

  const classNames = errorMessage
    ? `${styles.Input} ${styles.InputError}`
    : styles.Input;

  if (type === 'list') {
    return (
      <ListInput
        classNames={classNames}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        id={id}
        datalist={datalist || []}
      />
    );
  }

  if (type === 'phone') {
    return (
      <PhoneInput
        selectedCountryCode={selectedCountryCode}
        onCountryCodeChange={onCountryCodeChange}
        classNames={classNames}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <TextInput
      classNames={classNames}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      errorMessage={errorMessage}
    />
  );
};
