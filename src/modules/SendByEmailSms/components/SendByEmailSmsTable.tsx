import React, { useCallback, useEffect, useMemo } from 'react';
import validator from 'validator';
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import ReportProblemOutlined from '@material-ui/icons/ReportProblemOutlined';
import { useQuery } from '@apollo/client';
import Table from '../../../components/Table/Table';
import styles from '../SendByEmailSms.module.css';
import { GET_ALL_PARTICIPANTS } from '../sendByEmailSms.gql';
import { useDispatch, useSelector } from 'react-redux';
import {
  initParticipants,
  selectdraftParticipants,
  removeParticipant,
  updateParticipantFieldValue,
  IParticipant,
} from '../sendByEmailSms.redux';
import { Row } from 'react-table';
import { getRowErrorStatus } from '../../../components/Table/EditableCell';

export const SendByEmailSmsTable = () => {
  const dispatch = useDispatch();
  const participants = useSelector(selectdraftParticipants);

  const columns = useMemo(
    () => [
      {
        id: 'arrow-icon',
        Cell: ({
          row,
          validations,
        }: {
          row: Row<IParticipant>;
          validations: {
            [key: string]: (value: string) => string;
          };
        }) => {
          const isError = getRowErrorStatus(validations, row.original);
          if (isError) {
            return (
              <div>
                <ReportProblemOutlined fontSize="small" color="error" />
                <ArrowRightAltOutlinedIcon fontSize="small" color="error" />
              </div>
            );
          }

          return (
            <div>
              <ReportProblemOutlined
                fontSize="small"
                className={styles.HiddenIcon}
              />
              <ArrowRightAltOutlinedIcon fontSize="small" />
            </div>
          );
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        validation: (value: string) => {
          if (!validator.isEmail(value)) {
            return 'Invalid email';
          }
          if (participants.filter((p) => p.email === value).length > 1) {
            return 'Email already exists';
          }
          return '';
        },
      },
      {
        Header: 'Phone number',
        accessor: 'phoneNumber',
        type: 'phone',
        validation: (value: string) => {
          if (!validator.isMobilePhone(value)) {
            return 'Invalid phone number';
          }
          return '';
        },
      },
      {
        Header: 'First name',
        accessor: 'firstName',
      },
      {
        Header: 'Last name',
        accessor: 'lastName',
      },
      {
        Header: 'Group',
        accessor: 'group',
        datalist: ['The Mandalorian', 'Grogu', 'Greef Karga', 'The Client'],
      },
      {
        id: 'delete-btn',
        Cell: ({ row }: { row: Row<IParticipant> }) => (
          <div
            className={styles.IconWrapper}
            onClick={() => dispatch(removeParticipant(row.original.id))}
          >
            <RemoveCircleOutlineOutlinedIcon fontSize="small" color="error" />
          </div>
        ),
      },
    ],
    [participants]
  );

  const { data, error } = useQuery(GET_ALL_PARTICIPANTS);

  useEffect(() => {
    if (!error && data) {
      dispatch(initParticipants(data.participants));
    }
  }, [data, error]);

  const onCellChange = useCallback((id, fieldName, value, rowValid) => {
    dispatch(updateParticipantFieldValue({ id, fieldName, value, rowValid }));
  }, []);

  return (
    <Table columns={columns} data={participants} onCellChange={onCellChange} />
  );
};
