import React from 'react';
import { Row } from 'react-table';
import styles from './Table.module.css';
import { IColumn } from './Table';

const gerRowErrorStatus = (errors?: any) => {
  if (!errors) {
    return false;
  }
  for (const key in errors) {
    const isError = errors[key];
    if (isError) {
      return true;
    }
  }
  return false;
};

export const EditableCell = ({
  value: initialValue,
  row: { index, state, setState },
  column: { id, type, datalist, validation },
  onCellChange,
}: {
  value: string;
  row: Row & { setState: (state: any) => {}; state: any };
  column: IColumn;
  onCellChange: (
    index: number,
    id: any,
    value: string,
    rowValid: boolean
  ) => void;
}) => {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState(false);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    if (validation && !validation(value || '')) {
      setError(true);
      setState((old: any) => {
        const errors = old.errors || {};
        errors[id || ''] = true;
        old.errors = errors;
        onCellChange(index, id, value, !gerRowErrorStatus(errors));
        return { ...old };
      });
      return;
    }
    setError(false);
    setState((old: any) => {
      const errors = old.errors || {};
      errors[id || ''] = false;
      old.errors = errors;
      onCellChange(index, id, value, !gerRowErrorStatus(errors));
      return { ...old };
    });
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const classNames = error
    ? `${styles.Input} ${styles.InputError}`
    : styles.Input;

  if (datalist) {
    return (
      <>
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
      </>
    );
  }

  if (type === 'phone') {
    return (
      <input
        className={classNames}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  }

  return (
    <input
      className={classNames}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
