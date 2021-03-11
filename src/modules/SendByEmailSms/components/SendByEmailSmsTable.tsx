import React, { useCallback, useEffect, useMemo } from 'react';
import validator from 'validator';
import ArrowRightAltOutlinedIcon from '@material-ui/icons/ArrowRightAltOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import { useQuery } from '@apollo/client';
import Table from '../../../components/Table/Table';
import styles from '../SendByEmailSms.module.css';
import { GET_ALL_PARTICIPANTS } from '../sendByEmailSms.gql';
import { useDispatch, useSelector } from 'react-redux';
import {
  initParticipants,
  selectDrafParticipants,
  removeParticipant,
  updateParticipantFieldByIndex,
} from '../sendByEmailSms.redux';

export const SendByEmailSmsTable = () => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        id: 'arrow-icon',
        Cell: ({ row }: any) => {
          if (!row.state.errors) {
            return <ArrowRightAltOutlinedIcon fontSize="small" />;
          }
          for (const key in row.state.errors) {
            const isError = row.state.errors[key];
            if (isError) {
              return (
                <ArrowRightAltOutlinedIcon fontSize="small" color="error" />
              );
            }
          }
          return <ArrowRightAltOutlinedIcon fontSize="small" />;
        },
      },
      {
        Header: 'Email',
        accessor: 'email',
        validation: validator.isEmail,
      },
      {
        Header: 'Phone number',
        accessor: 'phoneNumber',
        type: 'phone',
        validation: validator.isMobilePhone,
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
        Cell: ({ row }) => (
          <div
            className={styles.IconWrapper}
            onClick={() => dispatch(removeParticipant(row.original.id))}
          >
            <RemoveCircleOutlineOutlinedIcon fontSize="small" color="error" />
          </div>
        ),
      },
    ],
    []
  );

  const participants = useSelector(selectDrafParticipants);

  const { data, error } = useQuery(GET_ALL_PARTICIPANTS);

  useEffect(() => {
    if (!error && data) {
      dispatch(initParticipants(data.participants));
    }
  }, [data, error]);

  const onCellChange = useCallback((index, id, value, rowValid) => {
    dispatch(updateParticipantFieldByIndex({ index, id, value, rowValid }));
  }, []);

  return (
    <Table columns={columns} data={participants} onCellChange={onCellChange} />
  );
};
