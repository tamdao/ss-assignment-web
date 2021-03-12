import React, { useEffect, useState } from 'react';
import { Row } from 'react-table';
import styles from './Table.module.css';
import { IColumn } from './Table';

export const getRowErrorStatus = (
  validations: {
    [key: string]: (value: string) => string;
  },
  data: any
) => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (validations[key]) {
        if (validations[key](value)) {
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
  column: { id, type, datalist, validation },
  onCellChange,
  validations,
}: {
  value: string;
  row: Row;
  column: IColumn;
  onCellChange: (
    index: number,
    id: any,
    value: string,
    rowValid: boolean
  ) => void;
  validations: {
    [key: string]: (value: string) => string;
  };
}) => {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState(
    validation ? validation(initialValue) : ''
  );

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    setErrorMessage(validation ? validation(value || '') : '');
    onCellChange(
      index,
      id,
      value,
      !getRowErrorStatus(validations, { ...original, [id || '']: value })
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setErrorMessage(validation ? validation(initialValue) : '');
    onCellChange(
      index,
      id,
      value,
      !getRowErrorStatus(validations, { ...original, [id || '']: value })
    );
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

  if (type === 'contry') {
    return <div className={styles.ContryContainer}></div>;
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
