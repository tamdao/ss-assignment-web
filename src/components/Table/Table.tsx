import React, { useMemo } from 'react';
import { useTable, Column } from 'react-table';
import { EditableCell } from './EditableCell';
import styles from './Table.module.css';

export type IColumn = {
  type?: string;
  datalist?: Array<string>;
  validation?: (value: string) => string;
} & Column;

interface IProps {
  columns: IColumn[];
  data: Array<any>;
  onCellChange: (
    index: number,
    id: any,
    value: string,
    rowValid: boolean
  ) => void;
}

const defaultColumn = {
  Cell: EditableCell,
};

const Table: React.FC<IProps> = ({ columns, data, onCellChange }) => {
  const validations = useMemo(
    () =>
      columns.reduce((prevValues: any, currValue) => {
        if (currValue.accessor && currValue.validation) {
          prevValues[currValue.accessor as string] = currValue.validation;
        }
        return prevValues;
      }, {}),
    [columns]
  );

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn,
    onCellChange,
    validations,
  } as any);

  return (
    <>
      <table {...getTableProps()} className={styles.Table}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={styles.Th}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
