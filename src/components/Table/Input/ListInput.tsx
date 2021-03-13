import React from 'react';

import styles from '../Table.module.css';

interface IProps {
  classNames: string;
  value: string;
  onChange: (e: any) => void;
  onBlur: () => void;
  id: string | undefined;
  datalist: string[];
}

export function ListInput({
  classNames,
  value,
  onChange,
  onBlur,
  id,
  datalist,
}: IProps) {
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
