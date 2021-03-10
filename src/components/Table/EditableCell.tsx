import React from 'react';
import { Row } from 'react-table';
import styles from './Table.module.css';
import { IColumn } from './Table';

export const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id, type, datalist },
  onCellChange,
}: {
  value: string;
  row: Row;
  column: IColumn;
  onCellChange: (index: number, id: any, value: string) => void;
}) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    onCellChange(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (datalist) {
    return (
      <>
        <input
          className={styles.Input}
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

  return (
    <input
      className={styles.Input}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
