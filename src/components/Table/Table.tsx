import React from 'react';
import { useTable, useExpanded, Column, useRowState } from 'react-table';
import { EditableCell } from './EditableCell';
import styles from './Table.module.css';

export type IColumn = {
  type?: string;
  datalist?: Array<string>;
  validation?: (value: string) => boolean;
} & Column;

interface IProps {
  columns: IColumn[];
  data: Array<any>;
  onCellChange: (index: number, id: any, value: string) => void;
}

const defaultColumn = {
  Cell: EditableCell,
};

const Table: React.FC<IProps> = ({ columns, data, onCellChange }) => {
  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      onCellChange,
    } as any,
    useRowState
  );

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
